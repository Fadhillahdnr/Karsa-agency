import { z } from 'zod'

const translationSchema = z.object({
  question: z.string().trim().min(2).max(300),
  answer: z.string().trim().min(2).max(3000),
})

export const faqSchema = z.object({
  category: z.string().trim().max(80).optional().or(z.literal('')),
  relatedService: z.string().uuid().nullable().optional(),
  orderIndex: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
})

export const faqUpdateSchema = faqSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
})

export type FaqInput = z.infer<typeof faqSchema>
export type FaqUpdateInput = z.infer<typeof faqUpdateSchema>
