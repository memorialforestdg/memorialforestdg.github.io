import { extractMetadataToJsonFile } from './exif-extract/exif-extract.mjs'

// Call extractToJson with options
extractMetadataToJsonFile({
  __dirname,
  srcDir,
  outputPath,
  //   exifTags,
  validExtensions
})
  .then((result) => {
    console.log('extractToJson did not encounter errors.')
  })
  .catch((error) => {
    console.error('Error:', error)
  })
