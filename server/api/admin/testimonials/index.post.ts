import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { testimonialSchema } from '../../../validation/testimonial'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = testimonialSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      quote: input.quote,
      person_name: input.personName,
      person_role: input.personRole || null,
      company: input.company || null,
      client_id: input.clientId ?? null,
      project_id: input.projectId ?? null,
      avatar_media_id: input.avatarMediaId ?? null,
      source: input.source || null,
      source_url: input.sourceUrl || null,
      permission_to_show: input.permissionToShow,
      featured: input.featured,
      order_index: input.orderIndex,
      status: input.status,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: 'Could not create testimonial' })
  }

  setResponseStatus(event, 201)
  return data
})
