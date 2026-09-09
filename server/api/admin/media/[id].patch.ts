import { z } from 'zod'
import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

const updateSchema = z.object({
  altText: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
  rightsStatus: z.string().max(200).optional(),
  credit: z.string().max(200).optional(),
  source: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { altText, caption, rightsStatus, credit, source } = parsed.data

  const { data, error } = await supabase
    .from('media_assets')
    .update({
      ...(altText !== undefined && { alt_text: altText }),
      ...(caption !== undefined && { caption }),
      ...(rightsStatus !== undefined && { rights_status: rightsStatus }),
      ...(credit !== undefined && { credit }),
      ...(source !== undefined && { source }),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Media asset not found' })
  }

  return data
})
