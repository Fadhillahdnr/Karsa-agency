export const leadStatuses = ['new', 'contacted', 'won', 'archived'] as const
export type LeadStatus = (typeof leadStatuses)[number]

export const leadStatusLabel: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  won: 'Won',
  archived: 'Archived',
}

export const leadStatusTone: Record<LeadStatus, 'neutral' | 'accent' | 'warning' | 'danger'> = {
  new: 'warning',
  contacted: 'neutral',
  won: 'accent',
  archived: 'neutral',
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
