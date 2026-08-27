import { z } from 'zod'

export const leadStatuses = ['new', 'contacted', 'won', 'archived'] as const

export const leadStatusUpdateSchema = z.object({
  status: z.enum(leadStatuses),
})

export type LeadStatus = (typeof leadStatuses)[number]
