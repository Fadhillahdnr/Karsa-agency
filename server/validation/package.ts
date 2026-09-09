import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  priceNote: z.string().trim().max(200).optional().or(z.literal('')),
  recommendedFor: z.string().trim().max(300).optional().or(z.literal('')),
  durationNote: z.string().trim().max(150).optional().or(z.literal('')),
  revisionNote: z.string().trim().max(150).optional().or(z.literal('')),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal('')),
  seoTitle: z.string().trim().max(120).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

const itemSchema = z.object({
  label: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  isHighlight: z.boolean().default(false),
})

export const packageSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  category: z.enum(['solo', 'combo', 'signature', 'maintenance']),
  priceType: z.enum(['fixed', 'starting_from', 'custom', 'monthly']),
  price: z.number().nonnegative().nullable().optional(),
  currency: z.string().trim().length(3).default('IDR'),
  badge: z.string().trim().max(40).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
  serviceIds: z.array(z.string().uuid()).max(20).default([]),
  items: z.array(itemSchema).max(30).default([]),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
})

export const packageUpdateSchema = packageSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
})

export type PackageInput = z.infer<typeof packageSchema>
export type PackageUpdateInput = z.infer<typeof packageUpdateSchema>
