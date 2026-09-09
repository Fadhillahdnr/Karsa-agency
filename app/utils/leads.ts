export const leadStatuses = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'won', 'lost', 'archived'] as const
export type LeadStatus = (typeof leadStatuses)[number]

export const leadStatusLabel: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  discovery: 'Discovery',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
}

export const leadStatusTone: Record<LeadStatus, 'neutral' | 'accent' | 'warning' | 'danger'> = {
  new: 'warning',
  contacted: 'neutral',
  qualified: 'neutral',
  discovery: 'neutral',
  proposal: 'accent',
  won: 'accent',
  lost: 'danger',
  archived: 'neutral',
}

export const leadPriorities = ['low', 'normal', 'high'] as const
export type LeadPriority = (typeof leadPriorities)[number]

export const leadPriorityLabel: Record<LeadPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
}

export const leadPriorityTone: Record<LeadPriority, 'neutral' | 'accent' | 'warning' | 'danger'> = {
  low: 'neutral',
  normal: 'neutral',
  high: 'danger',
}

export function formatRelativeDate(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.round(diffMs / 60_000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
