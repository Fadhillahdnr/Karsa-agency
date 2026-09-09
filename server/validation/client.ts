import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().toLowerCase()
    .min(2).max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  logoMediaId: z.string().uuid().nullable().optional(),
  websiteUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  industry: z.string().trim().max(150).optional().or(z.literal('')),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  permissionToShow: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

export const clientUpdateSchema = clientSchema.partial()

export type ClientInput = z.infer<typeof clientSchema>
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>
