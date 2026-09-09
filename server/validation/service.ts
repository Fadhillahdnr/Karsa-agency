import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().trim().min(2).max(150),
  shortTitle: z.string().trim().max(80).optional().or(z.literal('')),
  eyebrow: z.string().trim().max(80).optional().or(z.literal('')),
  summary: z.string().trim().max(500).optional().or(z.literal('')),
  intro: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
  whoItsFor: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
  problems: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
  deliverables: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
  included: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
  excluded: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
  process: z.string().trim().max(2000).optional().or(z.literal('')),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal('')),
  seoTitle: z.string().trim().max(120).optional().or(z.literal('')),
  seoDescription: z.string().trim().max(300).optional().or(z.literal('')),
})

const faqSchema = z.object({
  question: z.string().trim().min(2).max(300),
  answer: z.string().trim().min(2).max(2000),
})

export const serviceSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  category: z.enum(['web', 'design', 'photo', 'film', 'integrated']),
  parentId: z.string().uuid().nullable().optional(),
  coverMediaId: z.string().uuid().nullable().optional(),
  featured: z.boolean().default(false),
  showPrice: z.boolean().default(false),
  priceType: z.enum(['fixed', 'starting_from', 'custom', 'monthly']).nullable().optional(),
  startingPrice: z.number().nonnegative().nullable().optional(),
  currency: z.string().trim().length(3).default('IDR'),
  orderIndex: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullable().optional(),
  translations: z.object({
    en: translationSchema,
    id: translationSchema,
  }),
  faqs: z.object({
    en: z.array(faqSchema).max(20).default([]),
    id: z.array(faqSchema).max(20).default([]),
  }),
})

export const serviceUpdateSchema = serviceSchema.partial().extend({
  translations: z.object({
    en: translationSchema.partial().optional(),
    id: translationSchema.partial().optional(),
  }).optional(),
  faqs: z.object({
    en: z.array(faqSchema).max(20).optional(),
    id: z.array(faqSchema).max(20).optional(),
  }).optional(),
})

export type ServiceInput = z.infer<typeof serviceSchema>
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>
