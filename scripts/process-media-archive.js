import {
  extractMetadata,
  extractMetadataToJsonFile
} from './media-exif-extract.js'
import path from 'path'
import { fileURLToPath } from 'url'
import process from 'process'

/**
 * NOTE: there is some unevenness in exfitools/Adobe Bridge, and how they handle some tags on video files.
 * For example .mp4 files don't have a Keywords tag, and instead exfitools/Adobe Bridge will write to the 'Subject' tag instead.
 * We could normalize this in our script (ie massage json output) however the behavior appears consistent
 * between exfitools and Bridge for all file types, regardless of support for the "keyword" tag.
 */

// Get the directory path of the current module
// We don't have access to __dirname in ES module mode, so we need to reconstruct it.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The relative (or absolute) location of the source images
const relativeDir = '../src/media-archive'

// Convert the relative path to an absolute path
const srcDir = path.join(__dirname, relativeDir)

// The relative location of the output JSON file
const outputPath = '../src/content/media-archive/media-archive.json'

// The file types to include, defaults to ['.jpg', '.jpeg']
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp3', '.mp4']

// The EXIF fields to extract from media files
//
const exifTags = [
  'Title',
  'Description',
  'AltTextAccessibility',
  //   'Keywords',
  'Subject', // a consistent fallback for lack of Keywords tag on some file types
  { Creator: { val: 'Remembering Together Dumfries', write: true } },
  { Credit: { val: 'Remembering Together Dumfries', write: true } },
  { Source: { val: 'Remembering Together Dumfries', write: true } },
  'City',
  { State: { val: 'Dumfries & Galloway', write: true } },
  { CreatorPostalCode: { val: 'DG', write: true } },
  { Country: { val: 'Scotland', write: true } },
  { CountryCode: { val: '3166-2:GB', write: true } },

  {
    CreatorWorkEmail: {
      val: 'taco@gmail.com',
      write: true
    }
  },
  {
    CreatorWorkURL: {
      val: 'https://remembering-together-dumfries.co.uk',
      write: true
    }
  },
  {
    CopyrightNotice: {
      val: '© Some rights reserved, Remembering Together Dumfries & Galloway c/o Katie Anderson & Tara Beall.',
      write: true
    }
  },
  {
    'xmp:usageterms': {
      val: 'This work is licensed under Creative Commons Attribution-ShareAlike 4.0 International ',
      write: true
    }
  },
  { 'XMP-xmpRights:Marked': { val: 'CS-PUB', write: true } }, // CopyrightStatus
  'FileName',
  'SourceFile',
  'Directory',
  'FileType',
  'FileTypeExtension',
  'FileSize',
  'TrackDuration',
  'Duration',
  'CreateDate',
  'ImageWidth',
  'ImageHeight',
  'ImageSize',
  'Megapixels',
  'ShutterSpeed',
  'ApertureValue',
  'ISO',
  'FocalLength',
  'FocalLengthIn35mmFormat',
  'FocalLength35efl'
]

// Call extractToJson with options
extractMetadataToJsonFile({
  __dirname,
  srcDir,
  outputPath,
  exifTags,
  validExtensions
})
  .then((result) => {
    console.log('extractToJson did not encounter errors.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
