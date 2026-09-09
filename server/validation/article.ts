import { z } from 'zod'

const CATEGORIES = ['Website', 'Design', 'Photography', 'Video', 'Branding', 'Business', 'Creative Process'] as const

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  excerpt: z.string().trim().max(500).optional().or(z.literal('')),
  content: z.record(z.string(), z.unknown()).default({}),
  seoTitle: z.string().trim().max(120).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

export const articleSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  coverMediaId: z.string().uuid().nullable().optional(),
  author: z.string().trim().max(100).optional().or(z.literal('')),
  category: z.enum(CATEGORIES).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
  readingTime: z.number().int().positive().nullable().optional(),
  canonicalUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  ogMediaId: z.string().uuid().nullable().optional(),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
})

export const articleUpdateSchema = articleSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
})

export type ArticleInput = z.infer<typeof articleSchema>
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>
