import { z, defineCollection } from 'astro:content'
import { imageExifMetadata, archiveContributorsSchema, albumSchema } from '../schemas'

const mediaArchive = defineCollection({
  type: 'data',
  schema: imageExifMetadata
})
const archiveContributors = defineCollection({
  type: 'data',
  schema: archiveContributorsSchema
})
const albums = defineCollection({
  type: 'data',
  schema: albumSchema
});

export const collections = {
  albums,
  mediaArchive,
  archiveContributors
}
