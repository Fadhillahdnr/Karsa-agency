import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { LeadUpdate, LeadActivityInsert } from '../../../utils/supabase'
import { leadUpdateSchema } from '../../../validation/lead'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'sales'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })
  }

  const body = await readBody(event)
  const parsed = leadUpdateSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: parsed.error.flatten() })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data: existing } = await supabase.from('leads').select('status, assigned_to').eq('id', id).maybeSingle()
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Lead not found' })
  }

  const input = parsed.data
  const update: LeadUpdate = {}
  if (input.status !== undefined) update.status = input.status
  if (input.priority !== undefined) update.priority = input.priority
  if (input.assignedTo !== undefined) update.assigned_to = input.assignedTo
  if (input.lastContactedAt !== undefined) update.last_contacted_at = input.lastContactedAt
  if (input.nextFollowUpAt !== undefined) update.next_follow_up_at = input.nextFollowUpAt

  const { data, error } = await supabase
    .from('leads')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const activities: LeadActivityInsert[] = []
  if (input.status !== undefined && input.status !== existing.status) {
    activities.push({ lead_id: id, actor_id: user.id, type: 'status_changed', metadata: { from: existing.status, to: input.status } })
  }
  if (input.assignedTo !== undefined && input.assignedTo !== existing.assigned_to) {
    activities.push({ lead_id: id, actor_id: user.id, type: 'assigned', metadata: { assignedTo: input.assignedTo } })
  }
  if (input.nextFollowUpAt !== undefined) {
    activities.push({ lead_id: id, actor_id: user.id, type: 'follow_up_set', metadata: { nextFollowUpAt: input.nextFollowUpAt } })
  }
  if (activities.length) {
    await supabase.from('lead_activities').insert(activities)
  }

  return data
})
