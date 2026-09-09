import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { clientSchema } from '../../../validation/client'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = clientSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: input.name,
      slug: input.slug,
      logo_media_id: input.logoMediaId ?? null,
      website_url: input.websiteUrl || null,
      industry: input.industry || null,
      description: input.description || null,
      featured: input.featured,
      permission_to_show: input.permissionToShow,
      order_index: input.orderIndex,
      status: input.status,
    })
    .select('*')
    .single()

  if (error || !data) {
    if (error?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A client with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create client' })
  }

  setResponseStatus(event, 201)
  return data
})
