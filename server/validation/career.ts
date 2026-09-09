import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  responsibilities: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  requirements: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  niceToHave: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  seoTitle: z.string().trim().max(120).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

export const careerSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  department: z.string().trim().max(100).optional().or(z.literal('')),
  employmentType: z.string().trim().max(60).optional().or(z.literal('')),
  location: z.string().trim().max(100).optional().or(z.literal('')),
  workMode: z.string().trim().max(60).optional().or(z.literal('')),
  applicationUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  applicationEmail: z.string().trim().email().max(200).optional().or(z.literal('')),
  orderIndex: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
  closingAt: z.string().datetime().nullable().optional(),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
})

export const careerUpdateSchema = careerSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
})

export type CareerInput = z.infer<typeof careerSchema>
export type CareerUpdateInput = z.infer<typeof careerUpdateSchema>
