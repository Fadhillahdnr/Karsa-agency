import { z } from 'zod'

export const projectSchema = z.object({
  slug: z.string().trim().toLowerCase()
    .min(2).max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  title: z.string().trim().min(2).max(150),
  year: z.number().int().min(2000).max(2100),
  type: z.enum(['Independent Project', 'Internal Concept', 'Experimental Work']),
  category: z.string().trim().min(2).max(80),
  services: z.array(z.string().trim().min(1).max(60)).min(1).max(10),
  description: z.string().trim().min(10).max(500),
  cover: z.string().trim().url(),
  featured: z.boolean().default(false),
  challenge: z.string().trim().max(2000).optional().or(z.literal('')),
  approach: z.string().trim().max(2000).optional().or(z.literal('')),
  outcome: z.string().trim().max(2000).optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
})

export const projectUpdateSchema = projectSchema.partial()

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
