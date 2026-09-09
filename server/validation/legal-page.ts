import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  content: z.record(z.string(), z.unknown()).default({}),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

// Legal pages are a fixed 3-slug set (privacy/terms/terms-of-service) —
// only their translated content is ever edited, never the slug itself.
export const legalPageUpdateSchema = z.object({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }),
})

export type LegalPageUpdateInput = z.infer<typeof legalPageUpdateSchema>
