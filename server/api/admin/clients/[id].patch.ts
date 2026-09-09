import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ClientUpdate } from '../../../utils/supabase'
import { clientUpdateSchema } from '../../../validation/client'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = clientUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: ClientUpdate = {}

  if (input.name !== undefined) update.name = input.name
  if (input.slug !== undefined) update.slug = input.slug
  if (input.logoMediaId !== undefined) update.logo_media_id = input.logoMediaId
  if (input.websiteUrl !== undefined) update.website_url = input.websiteUrl || null
  if (input.industry !== undefined) update.industry = input.industry || null
  if (input.description !== undefined) update.description = input.description || null
  if (input.featured !== undefined) update.featured = input.featured
  if (input.permissionToShow !== undefined) update.permission_to_show = input.permissionToShow
  if (input.orderIndex !== undefined) update.order_index = input.orderIndex
  if (input.status !== undefined) update.status = input.status

  const { data, error } = await supabase
    .from('clients')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    if (error?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A client with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Client not found' })
  }

  return data
})
