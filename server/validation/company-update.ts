import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  excerpt: z.string().trim().max(500).optional().or(z.literal('')),
  content: z.record(z.string(), z.unknown()).default({}),
  seoTitle: z.string().trim().max(120).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

export const companyUpdateSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  coverMediaId: z.string().uuid().nullable().optional(),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
})

export const companyUpdateUpdateSchema = companyUpdateSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
})

export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>
export type CompanyUpdateUpdateInput = z.infer<typeof companyUpdateUpdateSchema>
