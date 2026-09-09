import { requireAdmin } from '../../../../utils/require-admin'
import { getSupabaseClient } from '../../../../utils/supabase'
import { leadNoteSchema } from '../../../../validation/lead'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'sales'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })
  }

  const body = await readBody(event)
  const parsed = leadNoteSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: parsed.error.flatten() })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data: note, error } = await supabase
    .from('lead_notes')
    .insert({ lead_id: id, author_id: user.id, note: parsed.data.note })
    .select()
    .single()

  if (error || !note) {
    throw createError({ statusCode: 500, statusMessage: 'Could not save note' })
  }

  await supabase.from('lead_activities').insert({
    lead_id: id,
    actor_id: user.id,
    type: 'note_added',
    metadata: {},
  })

  setResponseStatus(event, 201)
  return note
})
