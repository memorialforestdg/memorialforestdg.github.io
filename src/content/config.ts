import { z, defineCollection } from 'astro:content'
import { mediaArchiveSchema, archiveContributorsSchema } from '../schemas'

const mediaArchive = defineCollection({
  type: 'data',
  schema: mediaArchiveSchema
})
const archiveContributors = defineCollection({
  type: 'data',
  schema: archiveContributorsSchema
})

export const collections = {
  mediaArchive,
  archiveContributors
}
