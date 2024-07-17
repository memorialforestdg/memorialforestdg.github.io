import { extractMetadataToJsonFile } from 'exif-extract'
import { fileURLToPath } from 'url'
import path from 'path'

/**
 * NOTE: there is some unevenness in exfitools/Adobe Bridge, and how they handle some tags on video files.
 * For example .mp4 files don't have a Keywords tag, and instead exfitools/Adobe Bridge will write to the 'Subject' tag instead.
 * We could normalize this in our script (ie massage json output) however the behavior appears consistent
 * between exfitools and Bridge for all file types, regardless of support for the "keyword" tag.
 */

// Get the directory path of the current module
// We don't have access to __dirname in ES module mode, so we need to reconstruct it.
const rootDir = path.dirname(fileURLToPath(import.meta.url))

// The relative (or absolute) location of the source images
const sourceDir = '../src/content/albums'

// Convert the relative path to an absolute path
const srcDir = path.join(rootDir, sourceDir)

// The relative location of the output JSON file
const outputPath = '../src/meta/albums/albums-meta.json'

// The file types to include, defaults to ['.jpg', '.jpeg']
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif']

// The EXIF fields to extract from media files
const tagOptions = [
  { Creator: { val: 'FALLBACK TEST', write: true } },
  { AuthorsPosition: { val: 'FALLBACK TEST', write: true } },

  'CreatorContactInfo',
  { CreatorAddress: { val: 'FALLBACK TEST', write: true } },
  { CreatorCity: { val: 'FALLBACK TEST', write: true } },
  { CreatorRegion: { val: 'FALLBACK TEST', write: true } },
  { CreatorPostalCode: { val: 'FALLBACK TEST', write: true } },
  { CreatorCountry: { val: 'FALLBACK TEST', write: true } },
  { CreatorWorkTelephone: { val: 'FALLBACK TEST', write: true } },
  { CreatorWorkEmail: { val: 'FALLBACK TEST', write: true } },
  { CreatorWorkURL: { val: 'FALLBACK TEST', write: true } },
  'xmp:CreatorCity',
  { Headline: { val: 'FALLBACK TEST', write: true } },
  { Description: { val: 'FALLBACK TEST', write: true } },
  { AltTextAccessibility: { val: 'FALLBACK TEST', write: true } },
  { ExtDescrAccessibility: { val: 'FALLBACK TEST', write: true } },
  { Keywords: { val: 'FALLBACK TEST', write: true } },
  { Subject: { val: 'FALLBACK TEST', write: true } }, // A portable fallback' for the 'Keywords' tag on some file types
  { SubjectCode: { val: 'FALLBACK TEST', write: true } },
  { CaptionWriter: { val: 'FALLBACK TEST', write: true } },
  { DateCreated: { val: 'FALLBACK TEST', write: true } },
  { IntellectualGenre: { val: 'FALLBACK TEST', write: true } },
  { Scene: { val: 'FALLBACK TEST', write: true } },
  { City: { val: 'FALLBACK TEST', write: true } },
  { State: { val: 'FALLBACK TEST', write: true } },
  { Country: { val: 'FALLBACK TEST', write: true } },
  { CountryCode: { val: 'FALLBACK TEST', write: true } },
  { Title: { val: 'FALLBACK TEST', write: true } },
  { TransmissionReference: { val: 'FALLBACK TEST', write: true } },
  { Instructions: { val: 'FALLBACK TEST', write: true } },
  { Credit: { val: 'FALLBACK TEST', write: true } },
  { Source: { val: 'FALLBACK TEST', write: true } },
  { CopyrightNotice: { val: 'FALLBACK TEST', write: true } },
  { CopyrightFlag: { val: null, write: true } }, // Adobe Bridge "Copyright Status"
  { CopyrightStatus: { val: null, write: true } }, // exfitools "Copyright Status"
  { UsageTerms: { val: 'FALLBACK TEST', write: true } }, // Adobe Bridge "Copyright Status"
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
  rootDir,
  outputPath,
  srcDir,
  tagOptions,
  validExtensions
})
  .then(console.log('extractToJson did not encounter errors.'))
  .catch((error) => {
    console.error('Error:', error)
  })
