import { requireAdmin } from '../../../../utils/require-admin'
import { getSupabaseClient } from '../../../../utils/supabase'
import type { LeadNoteRow, LeadActivityRow, AdminProfileRow } from '../../../../utils/supabase'

export type LeadTimelineEntry
  = | { kind: 'note', id: string, note: string, authorName: string | null, createdAt: string }
    | { kind: 'activity', id: string, activityType: LeadActivityRow['type'], metadata: Record<string, unknown>, actorName: string | null, createdAt: string }

// Merges lead_notes + lead_activities into one chronological timeline for
// the lead detail page (§47 "activity timeline" + "notes").
export default defineEventHandler(async (event): Promise<LeadTimelineEntry[]> => {
  await requireAdmin(event, ['super_admin', 'sales', 'viewer'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const [{ data: notes }, { data: activities }, { data: profiles }] = await Promise.all([
    supabase.from('lead_notes').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    supabase.from('lead_activities').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    supabase.from('admin_profiles').select('user_id, display_name'),
  ])

  const nameByUserId = new Map((profiles as Pick<AdminProfileRow, 'user_id' | 'display_name'>[] | null ?? []).map(p => [p.user_id, p.display_name]))

  const noteEntries: LeadTimelineEntry[] = (notes as LeadNoteRow[] | null ?? []).map(n => ({
    kind: 'note',
    id: n.id,
    note: n.note,
    authorName: n.author_id ? (nameByUserId.get(n.author_id) ?? null) : null,
    createdAt: n.created_at,
  }))

  const activityEntries: LeadTimelineEntry[] = (activities as LeadActivityRow[] | null ?? []).map(a => ({
    kind: 'activity',
    id: a.id,
    activityType: a.type,
    metadata: a.metadata,
    actorName: a.actor_id ? (nameByUserId.get(a.actor_id) ?? null) : null,
    createdAt: a.created_at,
  }))

  return [...noteEntries, ...activityEntries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})
