import fs from 'fs'
import { exiftool, ExifTool } from 'exiftool-vendored'
import path from 'path'
import process from 'process'
import { error } from 'console'

/**
 * Extract metadata from images in a directory and return it as an object, or write to file as JSON.
 *
 * Note: if returning data as an object from the exported extract function, remember to call process.exit(0) when you're done!
 *
 * const  results = await extract(opts).then(result => {
 *     console.log('Success:', result)
 *     process.exit(0)
 * }).catch(error => {
 *     // handel error
 *     console.error('Error:', error)
 *     process.exit(1)
 * });
 *
 *
 * Also note: there is unevenness in exiftool' ability to handle some tags on some file types.
 * For example .mp4 (perhaps other video files too) don't have native support for a 'Keywords' tag, and so Bridge will write to 'Subject' tag instead.
 * The behavior appears consistent but I don't know if this coming from exiftool or Bridge. But if you are using Bridge, it appears safe to use the
 * Keywords tag in Bridge, and the Subject tag will be ingested across media types -- as so far observed.
 *
 * @TODO currently exiftool.write() is failing to write tags back to files for some reason.
 */

/**
 * Type definition for an EXIF tag.
 *
 * @typedef {Object} ExifTag
 * @property {string | { [key: string]: { val: string, write?: boolean } | null } } key - The EXIF key, or an object with the key and value. The value may also optionally be a key, with a val and write boolean. The write boolean is optional and defaults to true.
 */

/**
 *  Type definition for options.
 *
 * @param {object} defaults - The default options.
 * @param {string} defaults.srcDir - Relative path of directory to traverse.
 * @param {string} defaults.outputPath - The relative path of the file to output JSON.
 * @param {array<ExifTag>} defaults.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} defaults.validExtensions - An array of valid media extensions.
 */

/**
 * Default options.
 *
 * @type {Options}
 */
const defaults = {
  __dirname: null,
  srcDir: null,
  outputPath: null,
  exifTags: [],
  validExtensions: ['.jpg', '.jpeg']
}

/**
 *  Validate options.
 *
 * @param {Options} opts - An options object containing the following properties:
 * @param {string} opts.__dirname - Absolute path to the relative project directory.
 * @param {string} opts.srcDir - Relative path of directory to traverse.
 * @param {string} opts.outputPath - A relative or absolute path to write JSON output, with filename.
 * @param {array<ExifTag>} opts.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} opts.validExtensions - An array of valid media extensions.
 */
function validateOptions(opts) {
  if (!opts || typeof opts !== 'object') {
    throw new Error(
      'You must pass an options object minimally containing: "__dirname", "srcDir", and "outputPath" properties. Instead Received:',
      opts
    )
  }
  validatePathParam(opts.__dirname, opts)

  validatePathParam(opts.srcDir, opts)

  // outputPath may be a relative path so check last as it needs a valid opts.__dirname to compute.
  if (path.isAbsolute(opts.outputPath)) {
    console.log('outputPath is absolute:', opts.outputPath)
    validatePathParam(opts.outputPath, opts)
  } else {
    const resolvedpath = path.resolve(opts.__dirname, opts.outputPath)
    validatePathParam(resolvedpath, opts)
  }
  if (opts.exifTags && !Array.isArray(opts.exifTags)) {
    throw new Error('exifTags must be an array. Received:', opts.exifTags)
  }
  if (opts.validExtensions && !Array.isArray(opts.validExtensions)) {
    throw new Error(
      'validExtensions must be an array. Received:',
      validExtensions
    )
  }
}

/**
 * Checks if a file or directory path is valid and writable.
 *
 * @param {string} filepath - The path to check for writability.
 * @param {Options} opts - The options object.
 * @return {boolean} Returns true if the path is writable, false otherwise.
 * @throws {Error} Throws an error if the path is not a valid path or the user does not have the correct permissions.
 */
function validatePathParam(filepath, opts) {
  try {
    // Get the key name as a string
    const keyName = Object.entries(opts).find(([k, v]) => v === filepath)?.[0]

    if (!filepath || typeof filepath !== 'string') {
      throw new Error(`${keyName} must be a string. Received: ${typeof path}`)
    }

    fs.access(filepath, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`${filepath} is not writable`)
        throw new Error(
          `${keyName} is not a valid path or you don't have the correct permissions? Received: ${path}`
        )
      } else {
        return true
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Merge default and user options.
 *
 * @param {Options} defaults - The default options.
 * @param {Options} userOptions - The user options.
 * @returns {Options} A merged options object.
 */
function mergeOptions(defaults, userOptions) {
  // Throw if userOptions are not valid.
  validateOptions(userOptions)

  const mergedOptions = { ...defaults }
  for (const key in userOptions) {
    if (userOptions.hasOwnProperty(key)) {
      mergedOptions[key] = userOptions[key]
    }
  }
  return mergedOptions
}

/**
 * Helper to check if a value is an object.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an object, false otherwise.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Helper function to derive the relative path from a file and the project root directory.
 *
 * @param {string} absPathRoot - The absolute path of the project root.
 * @param {string} absPathFile - The absolute path of the file.
 * @returns {string} The relative path.
 */
function calculateRelativePath(absPathRoot, absPathFile) {
  return path.relative(absPathRoot, absPathFile)
}

/**
 * Function to recursively traverse directories
 *
 * @param {string} dir - Absolute path of directory to traverse.
 * @param @param {Array<string>} extensions - An array of valid extensions
 * @param @param {Array<string>} filesList - An optional array of files
 *
 * @returns {Promise<Array<object>>} - The list of files
 */
async function traverseDirectory(dir, extensions, filesList = []) {
  try {
    const files = await fs.promises.readdir(dir)
    for (const file of files) {
      if (file.startsWith('.')) {
        continue // Skip invisible files
      }

      const filePath = path.join(dir, file)
      const stat = await fs.promises.stat(filePath)

      if (stat.isDirectory()) {
        await traverseDirectory(filePath, extensions, filesList)
      } else {
        const fileExtension = path.extname(filePath).toLowerCase()
        if (extensions.includes(fileExtension)) {
          filesList.push(filePath)
        }
      }
    }
    return filesList
  } catch (error) {
    console.error(error) // Log the error
    throw new Error(`Error reading directory: ${dir}`, error)
  }
}

/**
 * Function to traverse each file in a directory and extract tag metadata.
 *
 * @param {string} dir
 * @param {string} __dirname
 * @param {array<string|object>} exifTags
 * @param {array<string>} allowedMediaFileExtensions
 *
 * @returns {Promise<array>} Array of objects with EXIF metadata from each media file.
 */
async function processDirectory(
  dir,
  __dirname,
  exifTags,
  allowedMediaFileExtensions
) {
  const files = await traverseDirectory(dir, allowedMediaFileExtensions)
  const metadataPromises = files.map(
    async (file) => await extractWriteTags(file, __dirname, exifTags)
  )
  const metadataList = await Promise.all(metadataPromises)
  return metadataList.filter(Boolean)
}

/**
 * Writes a tag and its value to a file.
 *
 * @param {string} absFilePath - The absolute path of the file.
 * @param {string} tag - The tag to write.
 * @param {string} val - The value of the tag.
 * @return {Promise<void>} A promise that resolves when the tag is successfully written to the file, or rejects with an error if there was a problem.
 */
async function writeTagToFile(absFilePath, tag, val) {
  try {
    // Will throw if the file is not writable.
    fs.access(absFilePath, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`File is not writable: ${absFilePath}`)
        throw new Error(`File is not writable: ${absFilePath}`)
      }
    })
    // Write the tag to the file
    // .write should return a resolved promise if successful, or reject with an error.
    // https://photostructure.github.io/exiftool-vendored.js/classes/ExifTool.html#write
    console.log(`Writing: ${tag}=${val} to ${absFilePath}`)
    await exiftool.write(absFilePath, { tag: val })
    console.log(
      `-- exiftool wrote: ${tag} : ${val} \n   to file: ${absFilePath}`
    )
  } catch (error) {
    console.error('Error updating tag:', error)
    throw error
  }
}

/**
 * Extracts tag metadata from a media file using exiftool-vendored.
 *
 * @param {string} absFilePath - Absolute path to the media file.
 * @param {string} __dirname - Absolute path to the relative project directory.
 * @param {Array<string|object>} [exifTags=[]] - An array of EXIF tags to extract.
 * @returns {Promise<object|Error>} - The metadata object or an error.
 * @throws {Error} - If there is an error reading the metadata.
 */
async function extractWriteTags(absFilePath, __dirname, exifTags = []) {
  try {
    console.log('Reading:', absFilePath)
    const metadata = await exiftool.read(absFilePath)
    let filteredMetadata = {}

    if (exifTags.length) {
      exifTags.forEach((entry) => {
        const tag = typeof entry === 'string' ? entry : Object.keys(entry)[0]
        const val = isObject(entry) ? entry[tag]?.val : entry[tag]

        // If the key doesn't exist, or only contains whitespace, add it.
        if (
          metadata[tag] === undefined ||
          metadata[tag] === null ||
          /^\s*$/.test(metadata[tag])
        ) {
          if (isObject(entry) && !entry[tag].hasOwnProperty('val')) {
            // Simple object {key: val}
            filteredMetadata[tag] = entry[tag]

            // Complex {key: {val: val, write: boolean}}
          } else if (isObject(entry) && entry[tag].hasOwnProperty('val')) {
            filteredMetadata[tag] = val
            if (entry[tag].write) {
              writeTagToFile(absFilePath, tag, val)
            }
          }
        } else {
          // the bare key exists in the exifTags, so if they key has a value in metadata, pass it over.
          if (metadata[tag]) {
            filteredMetadata[tag] = metadata[tag]
          }
        }
      })
    } else {
      // We've not passed a filter so return all metadata.
      filteredMetadata = metadata
    }
    filteredMetadata.SourceFile = calculateRelativePath(__dirname, absFilePath)
    filteredMetadata.Directory = calculateRelativePath(
      __dirname,
      path.dirname(absFilePath)
    )
    return filteredMetadata
  } catch (error) {
    console.error(`Error reading metadata for ${absFilePath}:`, error)
    process.exit(1)
    throw new Error(`Error reading metadata for ${absFilePath}:`, error)
  }
}

/**
 * Extract metadata from images in a directory and return it as an object.
 *
 * NOTE: Remember to call process.exit(0) when you're done!
 *
 * @param {Options} opts - An options object containing the following properties:
 * @param {string} opts.__dirname - Absolute path to the relative project directory.
 * @param {string} opts.srcDir - Relative path of directory to traverse.
 * @param {string} opts.outputPath - A relative or absolute path to write JSON output, with filename.
 * @param {array<ExifTag>} opts.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} opts.validExtensions - An array of valid media extensions.
 *
 * @returns {Promise<number|object|Error>} A Promise that resolves to 0 if successful or an error object.
 */
export async function extract(opts) {
  if (!opts || typeof opts !== 'object') {
    throw new Error('opts must be an object. Received:', opts)
  }
  const { __dirname, srcDir, exifTags, validExtensions } = mergeOptions(
    defaults,
    opts
  )

  try {
    const metadataList = await processDirectory(
      srcDir,
      __dirname,
      exifTags,
      validExtensions
    )
    console.log('Metadata extracted.')
    return Promise.resolve(metadataList) // Return the metadataList;
  } catch (error) {
    console.error('Error extracting metadata:', error)
    throw error
  }
}

/**
 * Extract metadata from images in a directory and save it to a JSON file.
 *
 * @param {Options} opts - An options object containing the following properties:
 * @param {string} opts.__dirname - Absolute path to the relative project directory.
 * @param {string} opts.srcDir - Relative path of directory to traverse.
 * @param {string} opts.outputPath - A relative or absolute path to write JSON output, with filename.
 * @param {array<ExifTag>} opts.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} opts.validExtensions - An array of valid media extensions.
 *
 * @returns {Promise<object|error>} A Promise that resolves to 0 if successful or an error object.
 */
export async function extractToJson(opts) {
  const { __dirname, srcDir, exifTags, validExtensions, outputPath } =
    mergeOptions(defaults, opts)

  try {
    const metadataList = await extract(opts)
    const jsonOutput = JSON.stringify(metadataList, null, 2)
    let derivedOutputPath = outputPath

    // Handel relative and absolute output paths.
    if (path.isAbsolute(outputPath)) {
      fs.writeFileSync(outputPath, jsonOutput)
    } else {
      derivedOutputPath = path.resolve(__dirname, outputPath)
      fs.writeFileSync(derivedOutputPath, jsonOutput)
    }
    console.log('Metadata saved as JSON to:', derivedOutputPath)
    return Promise.resolve(metadataList)
  } catch (error) {
    console.error('Error writing metadata to file:', error)
    throw error
  }
}
