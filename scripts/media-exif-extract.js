import fs from 'fs'
import { exiftool } from 'exiftool-vendored'
import path from 'path'
import process from 'process'
import { error, log } from 'console'

/**
 * Extract metadata from images in a directory and return it as an object, or write to file as JSON.
 *
 * Note: Remember to call process.exit(0) before exiting to close the process.
 *
 * const  results = await extractMetadata(opts).then(result => {
 *     console.log('Success:', result)
 *     process.exit(0)
 * }).catch(error => {
 *     // handel error
 *     console.error('Error:', error)
 *     process.exit(1)
 * });
 *
 *
 * Also note: there is a lot of unevenness between tags and media/file types file types, which tools like Bridge and exiftool try to normalize where possible.
 * For example .mp4 files don't have a Keywords tag, so instead eAdobe Bridge also writes to the 'Subject' tag as this tag has better availability across media.
 * Also tags differ widely between manufacturers and even models so test your use cases extensively.
 *
 * Writing:
 * When passing a an EXIF tag object with a write boolean set to true, the tag will be written to the media file possible. No all tags can be written to,
 * and some appear quite differently to fields that might appear in Adobe Bridge. For example, "Creator: Website(s)" in Adobe Bridge can be populated with the tag: "CreatorWorkURL"œ
 *
 *
 * @see https://exiftool.org/#links
 * @see https://exiftool.org/TagNames/
 *
 * // Common universal tags
 * @see https://exiftool.org/TagNames/EXIF.html
 * @see https://exiftool.org/TagNames/XMP.html
 * @see https://exiftool.org/TagNames/IPTC.html
 *
 * Common media tags
 * @see https://exiftool.org/TagNames/JPEG.html
 * @see https://exiftool.org/TagNames/PNG.html
 * @see https://exiftool.org/TagNames/GIF.html
 * @see https://exiftool.org/TagNames/MPEG.html | MP3 (MPEG-1 layer 3 audio), MPEG-2, etc.
 * @see https://exiftool.org/TagNames/QuickTime.html | MPEG-4, Apple QuickTime, etc.
 *
 * @todo complete the use of file write, by extracting the filename from the save path in both extractMetadataToJsonFile, and extractMetadata.
 * @todo add documentation on the asymmetry of tags like CreatorWorkURL and Creator: Website(s).
 */

/**
 * Type definition for an EXIF tag preference, which may be:
 *      - A string, the EXIF key name. This will simply include the tag value in the output, if it has been populated on the media file.
 *      - An object with the key and value. In this case, if the tag is not populated on the media file, the fallback value will be used if the key is not populated on the media file.
 *      - The value may also optionally be a key, with a val and write boolean. The write boolean is optional and defaults to false.
 *
 * @typedef {Object} ExifTag
 * @property {String | { [key: String]: { val: String, write?: Boolean } | null } } key - A string of EXIF key name, or an object with the key and value. The value may also optionally be a key, with a val and write boolean. The write boolean is optional and defaults to true.
 */

/**
 *  Type definition for user Options.
 *
 * @typedef {Object} Options - The default options.
 * @property {String} Options.srcDir - Relative path of directory to traverse.
 * @property {String} Options.outputPath - The relative path of the directory to write output.
 * @property {String} Options.fileName - The name of the output file with extension.
 * @property {Array.<ExifTag>} Options.exifTags - An array of EXIF tags to extract.
 * @property {Array.<string>} Options.validExtensions - An array of valid media extensions.
 */

/**
 * An array of missing tags per media file.
 *
 * @type {Object.<string, { key: string, val: string }>} - An array of missing tags per media file.
 */
const missingTags = {}

/**
 * Default options.
 *
 * @type {Options}
 */
const defaults = {
  __dirname: '',
  srcDir: '',
  outputPath: '',
  fileName: 'metadata.json',
  exifTags: [],
  validExtensions: ['.jpg', '.jpeg']
}

/**
 *  Validate options. Throws if the options object is not formed correctly.
 *
 * @param {Options} opts - An options object containing the following properties:
 *   - __dirname: Absolute path to the relative project directory.
 *   - srcDir: Relative path of directory to traverse.
 *   - outputPath: A relative or absolute path to write JSON output, with filename.
 *   - exifTags: An array of EXIF tags to extract.
 *   - validExtensions: An array of valid media extensions.
 *
 * @returns {Void}
 *
 * @throws {Error} Throws an error if the options object is missing or not an object.
 * @throws {Error} Throws an error if the __dirname, srcDir, or outputPath property is missing or invalid.
 * @throws {Error} Throws an error if the exifTags property is present but not an array.
 * @throws {Error} Throws an error if the validExtensions property is present but not an array.
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
 * @param {String} filepath - The path to check for write-ability.
 * @param {Options} opts - An options object containing the following properties:
 *   - __dirname: Absolute path to the relative project directory.
 *   - srcDir: Relative path of directory to traverse.
 *   - outputPath: A relative or absolute path to write JSON output, with filename.
 *   - exifTags: An array of EXIF tags to extract.
 *   - validExtensions: An array of valid media extensions.
 *
 * @return {Boolean} Returns true if the path is writable, false otherwise.
 *
 * @throws {Error} Throws an error if the path is not a valid path or does not have write permissions.
 */
function validatePathParam(filepath, opts) {
  try {
    // Get the key name as a string
    const keyName = Object.entries(opts).find(([k, v]) => v === filepath)?.[0]

    if (!filepath || typeof filepath !== 'string') {
      throw new Error(`${keyName} must be a string. Received: ${typeof path}`)
    }

    // Check if the path is valid
    fs.access(path.dirname(filepath), fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`${path.dirname(filepath)} is not writable`)
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
 *
 *   - __dirname: Absolute path to the relative project directory.
 *   - srcDir: Relative path of directory to traverse.
 *   - outputPath: A relative or absolute path to write JSON output, with filename.
 *   - exifTags: An array of EXIF tags to extract.
 *   - validExtensions: An array of valid media extensions.
 *
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
 * @returns {Boolean} True if the value is an object, false otherwise.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Function to recursively traverse directories and return all files with a given extension.
 *
 * @param {String} dir - Absolute path of directory to traverse.
 * @param @param {Array.<String>} extensions - An array of valid extensions
 * @param @param {Array.<String>} filesList - An optional array of files
 *
 * @returns {Promise<Array.<Object>>} - The list of files
 */
async function getFiles(dir, extensions, filesList = []) {
  try {
    const files = await fs.promises.readdir(dir)
    for (const file of files) {
      if (file.startsWith('.')) {
        continue // Skip invisible files
      }

      const filePath = path.join(dir, file)
      const stat = await fs.promises.stat(filePath)

      if (stat.isDirectory()) {
        await getFiles(filePath, extensions, filesList)
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
 * Allows for parallel processing of images by mapping over files and collecting the promises, and using Promise.allSettled
 *
 * @param {String} dir
 * @param {String} __dirname
 * @param {Array.<ExifTag>} exifTags
 * @param {Array.<string>} allowedMediaFileExtensions
 *
 * @returns {Promise<Array>} Array of objects with EXIF metadata from each media file.
 */
async function processDirectories(
  dir,
  __dirname,
  exifTags,
  allowedMediaFileExtensions
) {
  const files = await getFiles(dir, allowedMediaFileExtensions)

  if (files.length === 0) {
    throw new Error(`No media files found in ${dir}`)
  }
  const metadataPromises = files.map(
    async (file) => await filterTags(file, __dirname, exifTags)
  )
  try {
    const metadataList = await Promise.allSettled(metadataPromises)
    // Filter out any potential empty values
    return metadataList.filter(Boolean).map((result) => result.value)
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Writes a tag and its value to a file.
 *
 * @param {String} absFilePath - The absolute path of the file.
 * @param {String} tag - The tag to write.
 * @param {String} val - The value of the tag.
 *
 * @return {Promise<void>} A promise that resolves when the tag is successfully written to the file, or rejects with an error if there was a problem.
 */
async function writeTagToFile(absFilePath, tag, val) {
  try {
    await fs.promises.access(absFilePath, fs.constants.W_OK)
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File does not exist: ${absFilePath}`)
    } else if (error.code === 'EACCES') {
      throw new Error(`File is not writable: ${absFilePath}`, error)
    } else {
      throw error
    }
  }
  try {
    console.log(
      `-- exiftool writing: ${tag} : ${val} \n   to file: ${absFilePath}` // fires
    )
    const result = await exiftool.write(absFilePath, { [tag]: val })
    console.warn(`-- exiftool reports: ${JSON.stringify(result)}`)
  } catch (error) {
    console.error('-- exiftool write error:', error)
    throw error
  }
}

/**
 * Extracts the file name from the absolute file path, constructs an error object with the file name as key, and pushes it to the tagErrors array.
 *
 * @param {String} absFilePath - The absolute file path.
 * @param {String} tag - The missing exif tag.
 * @param {String} val - The default value for the missing exif tag.
 *
 * @return {Void} This function does not return a value.
 */
function logMissingTag(absFilePath, tag, val) {
  // extract the file name from absFilePath
  const fileName = path.basename(absFilePath)

  if (!missingTags[fileName]) {
    missingTags[fileName] = {}
  }
  // push to the missingTags array
  missingTags[fileName][tag] = val
}

/**
 * Filters out the provided EXIF tags from an image's metadata.
 *
 * @param {string} absFilePath - The absolute path to the media file.
 * @param {string} __dirname - The absolute path to the project directory.
 * @param {Array.<string|Object>} [exifTags=[]] - The EXIF tags to filter.
 *
 * @returns {Promise<Object|Error>} - The filtered metadata object or an error.
 *
 * @throws {Error} - If there is an error reading the metadata.
 */
async function filterTags(absFilePath, __dirname, exifTags = []) {
  try {
    console.log('Reading:', absFilePath)
    const metadata = await exiftool.read(absFilePath)
    const filteredMetadata = {}

    if (exifTags.length) {
      for (const entry of exifTags) {
        const tag = typeof entry === 'string' ? entry : Object.keys(entry)[0]
        const val = isObject(entry) ? entry[tag]?.val : entry[tag]

        if (
          metadata[tag] === undefined ||
          metadata[tag] === null ||
          /^\s*$/.test(metadata[tag])
        ) {
          if (isObject(entry) && !entry[tag].hasOwnProperty('val')) {
            filteredMetadata[tag] = entry[tag]
          } else if (isObject(entry) && entry[tag].hasOwnProperty('val')) {
            filteredMetadata[tag] = val
            if (entry[tag].write) {
              await writeTagToFile(absFilePath, tag, val)
              logMissingTag(absFilePath, tag, val)
            }
          }
        } else {
          if (metadata[tag]) {
            filteredMetadata[tag] = metadata[tag]
          }
        }
      }
    } else {
      // We've not passed a filter so return all metadata.
      filteredMetadata = metadata
    }
    filteredMetadata.SourceFile = path.relative(__dirname, absFilePath)
    filteredMetadata.Directory = path.relative(
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
 * Writes a file to disk.
 * Warning will overwrite any existing file of the same name.
 *
 * @param {string} fileName - The name of the file.
 * @param {string} filePath - The path to the file to write.
 * @param {string} writeValue - The value to write to the file.
 * @param {boolean} [fileAppend=false] - A boolean indicating whether to append the writeValue to the file.
 * @param {string} [fileNamePrepend=null] - An optional string to prepend to the file name.
 *
 * @returns {Promise<void>} A promise that resolves when the file is written.
 *
 * @throws {TypeError} If writeValue is not a string.
 * @throws {TypeError} If the filePath is not a string.
 * @throws {TypeError} If the fileName is not a string.
 * @throws {TypeError} If the filePath is not writable.
 * @throws {TypeError} If fileNamePrepend is not a string.
 */
async function writeToFile(
  fileName,
  filePath,
  writeValue,
  fileAppend = false,
  fileNamePrepend = null
) {
  if (typeof writeValue !== 'string') {
    throw new TypeError('writeValue must be a string')
  }
  if (typeof filePath !== 'string') {
    throw new TypeError('filePath must be a string')
  }
  if (typeof fileName !== 'string') {
    throw new TypeError('fileName must be a string')
  }
  if (typeof fileAppend !== 'boolean') {
    throw new TypeError('fileAppend must be a boolean')
  }
  if (fileNamePrepend !== null && typeof fileNamePrepend !== 'string') {
    throw new TypeError('fileNamePrepend must be a string')
  }

  const newFileName = fileNamePrepend
    ? `${fileNamePrepend}${fileName}`
    : fileName
  const newFilePath = path.join(path.dirname(filePath), newFileName)

  try {
    await fs.promises.access(filePath, fs.constants.W_OK)
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new Error(`File is not writable: ${filePath}`, error)
    }
    throw error
  }

  if (fileAppend) {
    await fs.promises.appendFile(newFilePath, writeValue)
  } else {
    await fs.promises.writeFile(newFilePath, writeValue)
  }
}

/**
 * Extract metadata from images in a directory and return it as an object.
 *
 * NOTE: Remember to call process.exit(0) when you're done!
 *
 * @param {Options} opts - An options object containing the following properties:
 *   - __dirname: Absolute path to the relative project directory.
 *   - srcDir: Relative path of directory to traverse.
 *   - outputPath: A relative or absolute path to write JSON output, with filename.
 *   - exifTags: An array of EXIF tags to extract.
 *   - validExtensions: An array of valid media extensions.
 *
 * @returns {Promise<Number|Object|Error>} A Promise that resolves to 0 if successful or an error object.
 *
 * @throws {Error} If there is an error extracting metadata.
 */
export async function extractMetadata(opts) {
  if (!opts || typeof opts !== 'object') {
    throw new Error('opts must be an object. Received:', opts)
  }
  const { __dirname, srcDir, exifTags, validExtensions } = mergeOptions(
    defaults,
    opts
  )

  try {
    const metadataList = await processDirectories(
      srcDir,
      __dirname,
      exifTags,
      validExtensions
    )
    console.log('Metadata extracted.')
    if (missingTags.length > 0) {
      console.error('Missing metadata:', missingTags)
    }
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
 *   - __dirname: Absolute path to the relative project directory.
 *   - srcDir: Relative path of directory to traverse.
 *   - outputPath: A relative or absolute path to write JSON output, with filename.
 *   - exifTags: An array of EXIF tags to extract.
 *   - validExtensions: An array of valid media extensions.
 *
 * @returns {Promise<Object|Error>} A Promise that resolves to an object with the extracted metadata or an error object.
 */
export async function extractMetadataToJsonFile(opts) {
  const { __dirname, srcDir, exifTags, validExtensions, outputPath } =
    mergeOptions(defaults, opts)
  try {
    const metadata = await extractMetadata(opts)
    const jsonOutput = JSON.stringify(metadata, null, 2)

    // Handle relative and absolute output paths.
    if (path.isAbsolute(outputPath)) {
      fs.writeFileSync(outputPath, jsonOutput)
    } else {
      fs.writeFileSync(path.resolve(__dirname, outputPath), jsonOutput)
    }
    console.log(
      'Metadata saved as JSON to:',
      path.resolve(__dirname, outputPath)
    )

    if (missingTags) {
      try {
        const now = new Date()
        await writeToFile(
          'missing-tags.json',
          path.resolve(__dirname, outputPath),
          JSON.stringify(missingTags, null, 2),
          false,
          now.getTime() + '-'
        )
      } catch (error) {
        console.error('Error writing missing tags log:', error)
        throw error
      }
    }

    return Promise.resolve(metadata)
  } catch (error) {
    console.error('Error writing metadata to file:', error)
    throw error
  }
}
