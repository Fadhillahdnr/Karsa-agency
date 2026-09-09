import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  description: z.string().trim().max(3000).optional().or(z.literal('')),
  credits: z.string().trim().max(500).optional().or(z.literal('')),
  seoTitle: z.string().trim().max(120).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

const itemSchema = z.object({
  mediaId: z.string().uuid().nullable().optional(),
  itemType: z.enum(['image', 'mockup', 'video', 'external_video', 'before', 'after', 'document']),
  externalUrl: z.string().trim().url().max(1000).optional().or(z.literal('')),
  posterMediaId: z.string().uuid().nullable().optional(),
  caption: z.string().trim().max(300).optional().or(z.literal('')),
  altText: z.string().trim().max(300).optional().or(z.literal('')),
  duration: z.number().nonnegative().nullable().optional(),
  aspectRatio: z.string().trim().max(20).optional().or(z.literal('')),
  featured: z.boolean().default(false),
})

export const portfolioCollectionSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  discipline: z.enum(['design', 'photography', 'videography']),
  category: z.string().trim().max(80).optional().or(z.literal('')),
  clientId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  coverMediaId: z.string().uuid().nullable().optional(),
  featured: z.boolean().default(false),
  permissionToShow: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
  items: z.array(itemSchema).max(60).default([]),
})

export const portfolioCollectionUpdateSchema = portfolioCollectionSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
})

export type PortfolioCollectionInput = z.infer<typeof portfolioCollectionSchema>
export type PortfolioCollectionUpdateInput = z.infer<typeof portfolioCollectionUpdateSchema>
