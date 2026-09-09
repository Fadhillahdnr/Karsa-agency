import { z } from 'zod'

export const leadStatuses = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'won', 'lost', 'archived'] as const
export const leadPriorities = ['low', 'normal', 'high'] as const

export type LeadStatus = (typeof leadStatuses)[number]
export type LeadPriority = (typeof leadPriorities)[number]

export const leadStatusUpdateSchema = z.object({
  status: z.enum(leadStatuses),
})

// CRM fields an admin can edit from the lead detail page. All optional/
// partial — the PATCH endpoint only applies fields that are present.
export const leadUpdateSchema = z.object({
  status: z.enum(leadStatuses).optional(),
  priority: z.enum(leadPriorities).optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  lastContactedAt: z.string().datetime().nullable().optional(),
  nextFollowUpAt: z.string().datetime().nullable().optional(),
})

export const leadNoteSchema = z.object({
  note: z.string().trim().min(1).max(4000),
})

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>
export type LeadNoteInput = z.infer<typeof leadNoteSchema>
