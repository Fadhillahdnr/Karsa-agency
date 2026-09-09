import { z } from 'zod'
import { requireAdmin } from '../../../../../utils/require-admin'
import { getSupabaseClient } from '../../../../../utils/supabase'

const updateSchema = z.object({
  enabled: z.boolean().optional(),
  orderIndex: z.number().int().min(0).optional(),
  themeVariant: z.enum(['light', 'dark', 'neutral', 'auto']).nullable().optional(),
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

  const { enabled, orderIndex, themeVariant } = parsed.data

  const { data, error } = await supabase
    .from('page_sections')
    .update({
      ...(enabled !== undefined && { enabled }),
      ...(orderIndex !== undefined && { order_index: orderIndex }),
      ...(themeVariant !== undefined && { theme_variant: themeVariant }),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Section not found' })
  }

  return data
})
