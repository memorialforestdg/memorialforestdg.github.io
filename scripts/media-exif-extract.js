import fs from 'fs'
import { exiftool } from 'exiftool-vendored'
import path from 'path'
import process from 'process'

/**
 * Extract metadata from images in a directory and return it as an object, or write to file as JSON.
 *
 * Note: if returning data as an object from the exported extract function, remember to call process.exit(0) when you're done!
 *
 * const  results = await extract(opts = {}).then(result => {
 *     console.log('Success:', result)
 *     process.exit(0)
 * }).catch(error => {
 *     // handel error
 *     console.error('Error:', error)
 *     process.exit(1)
 * });
 *
 */

/**
 * Default options.
 *
 * @param {object} defaults - The default options.
 * @param {string} defaults.srcDir - Relative path of directory to traverse.
 * @param {array<string|object>} defaults.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} defaults.validExtensions - An array of valid media extensions.
 * @param {string} defaults.outputPath - The relative path of the file to output JSON.
 */
const defaults = {
  __dirname: null,
  srcDir: null,
  exifTags: [],
  validExtensions: ['.jpg', '.jpeg'],
  outputPath: null
}

/**
 * Merge default and user options.
 *
 * @param {object} defaults - The default options.
 * @param {object} userOptions - The user options.
 * @returns {object} The merged options object.
 */
function mergeOptions(defaults, userOptions) {
  const mergedOptions = { ...defaults }
  for (const key in userOptions) {
    if (userOptions.hasOwnProperty(key)) {
      mergedOptions[key] = userOptions[key]
    }
  }
  return mergedOptions
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
 * Function to extract metadata from each file in a directory.
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
  const metadataPromises = files.map((file) =>
    extractMetadata(file, __dirname, exifTags)
  )
  const metadataList = await Promise.all(metadataPromises)
  return metadataList.filter(Boolean)
}

/**
 *  Function to extract metadata from a media file using exiftool-vendored.
 *
 * @param {string} absFilePath - Absolute path to the media file.
 * @param {string} __dirname - Absolute path to the relative project directory.
 * @param {Array<string|object>} exifTags - An array of EXIF tags to extracted.
 *
 * @returns {Promise<object|Error>} - The metadata object or an error.
 */
async function extractMetadata(absFilePath, __dirname, exifTags = []) {
  try {
    console.log('Reading:', absFilePath)
    const metadata = await exiftool.read(absFilePath)
    let filteredMetadata = {}
    if (exifTags.length) {
      exifTags.forEach((tag) => {
        if (typeof tag === 'string') {
          if (metadata.hasOwnProperty(tag)) {
            filteredMetadata[tag] = metadata[tag]
          }
        } else if (typeof tag === 'object') {
          const key = Object.keys(tag)[0]
          if (metadata.hasOwnProperty(key)) {
            if (metadata[key]) {
              filteredMetadata[key] = metadata[key]
            } else {
              filteredMetadata[key] = tag[key]
            }
          }
        }
      })
      // We've not passed a filter so return all metadata.
    } else {
      filteredMetadata = metadata
    }
    filteredMetadata
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
 * @todo: Remove function params for an options object with sane defaults.
 *
 * @param {Object} opts - Options object containing the following properties:
 * @param {string} opts.srcDir - Relative path of directory to traverse.
 * @param {array<string|object>} opts.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} opts.validExtensions - An array of valid media extensions.
 *
 * @returns {Promise<number|object|Error>} A Promise that resolves to 0 if successful or an error object.
 */
export async function extract(opts) {
  const { __dirname, srcDir, exifTags, validExtensions } = mergeOptions(
    defaults,
    opts
  )

  if (!__dirname || typeof __dirname !== 'string') {
    throw error('__dirname must be a string. Received:', __dirname)
  }
  if (fs.accessSync(__dirname) !== undefined) {
    throw error(
      `__dirname is not a valid path or you don't have the correct permissions. Received: ${srcDir}`
    )
  }
  if (!srcDir || typeof srcDir !== 'string') {
    throw error('srcDir must be a string. Received:', srcDir)
  }
  if (fs.accessSync(srcDir) !== undefined) {
    throw error(
      `srcDir is not a valid path or you don't have the correct permissions. Received: ${srcDir}`
    )
  }
  if (!Array.isArray(exifTags)) {
    throw error('exifTags must be an array. Received:', exifTags)
  }
  if (!Array.isArray(validExtensions)) {
    throw error('validExtensions must be an array. Received:', validExtensions)
  }
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
 * @param {Object} opts - Options object containing the following properties:
 * @param {string} opts.srcDir - Relative path of directory to traverse.
 * @param {array<string|object>} opts.exifTags - An array of EXIF tags to extract.
 * @param {array<string>} opts.validExtensions - An array of valid media extensions.
 * @param {string} opts.outputPath - The relative path of the file to output JSON.
 *
 * @returns {Promise<object|error>} A Promise that resolves to 0 if successful or an error object.
 */
export async function extractToJson(opts) {
  const { __dirname, srcDir, exifTags, validExtensions, outputPath } =
    mergeOptions(defaults, opts)

  if (!outputPath || typeof outputPath !== 'string') {
    throw error('OutputPath must be a string. Received:', outputPath)
  }

  const absPath = path.resolve(__dirname, outputPath)
  const absDirPath = path.dirname(absPath)

  try {
    fs.accessSync(absDirPath, fs.constants.W_OK)
  } catch (error) {
    throw new Error(`Directory ${absDirPath} is not writable: ${error.message}`)
  }

  try {
    const metadataList = await extract(opts)
    const absOutputPath = path.join(__dirname, outputPath)
    const jsonOutput = JSON.stringify(metadataList, null, 2)
    fs.writeFileSync(absOutputPath, jsonOutput)
    console.log('Metadata saved as JSON to:', absOutputPath)
    return Promise.resolve(metadataList)
  } catch (error) {
    console.error('Error writing metadata to file:', error)
    throw error
  }
}
