import { z } from 'zod'

export const testimonialSchema = z.object({
  quote: z.string().trim().min(10).max(2000),
  personName: z.string().trim().min(2).max(150),
  personRole: z.string().trim().max(150).optional().or(z.literal('')),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  clientId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  avatarMediaId: z.string().uuid().nullable().optional(),
  source: z.string().trim().max(150).optional().or(z.literal('')),
  sourceUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  permissionToShow: z.boolean().default(false),
  featured: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

export const testimonialUpdateSchema = testimonialSchema.partial()

export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>
