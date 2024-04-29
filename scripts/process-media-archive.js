import {extract, extractToJson} from './media-exif-extract.js';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// Get the directory path of the current module
// We don't have access to __dirname in ES module mode, so we need to reconstruct it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The relative location of the source images
const relativeDir = '../src/images/archive';

// Convert the relative path to an absolute path
const srcDir = path.join(__dirname, relativeDir);

// The relative location of the output JSON file
const outputPath = '../public/api/archive.json';

// The file types to include
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp3', '.mp4'];

// The EXIF fields to extract from media files
const exifTags = [
    { Keywords : "A boy loves tacos" },
    { CountryCode : "3166-2:GB" },
    { City : null },
    { State : "Dumfries & Galloway" },
    { Title : "Some great title" },
    { Description : null },
    { AltTextAccessibility : null },
    { Source : null },
    { Subject : null },
    { Rights : null },
    { Credit : null },
    { Copyright : null },
    'Source',
    'FileName',
    'SourceFile',
    'Directory',
    'FileType',
    'FileTypeExtension',
    'FileSize',
    'TrackDuration',
    'Duration',
    'CreateDate',
    'ShutterSpeed',
    'ApertureValue',
    'ISO',
    'FocalLength',
    'FocalLengthIn35mmFormat',
    'ImageWidth',
    'ImageHeight',
    'ImageSize',
    'Megapixels',
    'GPSLatitude',
    'GPSLongitude',
    'GPSAltitude',
    'GPSAltitudeRef',
    'GPSLongitudeRef',
    'GPSLatitudeRef',
    'GPSDateStamp',
    'GPSTimeStamp',
    'GPSStatus',
    'GPSMapDatum',
    'GPSTrac'
];

// Call extractToJson with options
const  results = await extractToJson(
    {
        __dirname,
        srcDir,
        exifTags,
        validExtensions,
        outputPath
    }
).then(result => {
    console.log('Extract successful.')
    process.exit(0);
}).catch(error => {
    console.error('Error:', error);
    process.exit(1);
});

console.log(Promise.resolve(results))