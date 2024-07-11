import { z } from 'astro:content'

const imageExifMetadata = z.object({
  Title: z.string(),
  Description: z.string().optional(),
  Subject: z.array(z.string()),
  Credit: z.string(),
  City: z.string(),
  State: z.string(),
  CountryCode: z.string(),
  Copyright: z.string().optional(),
  FileName: z.string(),
  SourceFile: z.string(),
  Directory: z.string(),
  FileType: z.string(),
  FileTypeExtension: z.string(),
  FileSize: z.string().optional(),
  AltTextAccessibility: z.string().optional(),
  Source: z.string(),
  Rights: z.string(),
  TrackDuration: z.number().optional(),
  Duration: z
    .union([
      z.object({
        Scale: z.number(),
        Value: z.number()
      }),
      z.number()
    ])
    .optional(),
  CreateDate: z.object({
    _ctor: z.string(),
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
    tzoffsetMinutes: z.number(),
    rawValue: z.string().transform((str) => new Date(str)),
    zoneName: z.string(),
    inferredZone: z.boolean()
  }),
  ImageinlineSize: z.number().optional(),
  ImageHeight: z.number().optional(),
  ImageSize: z.string().optional(),
  Megapixels: z.number().optional(),
  ShutterSpeed: z.string().optional(),
  ApertureValue: z.number().optional(),
  ISO: z.number().optional(),
  FocalLength: z.string().optional(),
  FocalLengthIn35mmFormat: z.string().optional(),
  FocalLength35efl: z.string().optional()
})

const archiveContributorsSchema = z.object({
  name: z.string().default('Anonymous'),
  url: z.string().url().optional()
})

const albumSchema = z.object({
  title: z.string(),
  description: z.string().optional()
})

export { imageExifMetadata, archiveContributorsSchema, albumSchema }
