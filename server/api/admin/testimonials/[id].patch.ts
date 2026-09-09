import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { TestimonialUpdate } from '../../../utils/supabase'
import { testimonialUpdateSchema } from '../../../validation/testimonial'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = testimonialUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: TestimonialUpdate = {}

  if (input.quote !== undefined) update.quote = input.quote
  if (input.personName !== undefined) update.person_name = input.personName
  if (input.personRole !== undefined) update.person_role = input.personRole || null
  if (input.company !== undefined) update.company = input.company || null
  if (input.clientId !== undefined) update.client_id = input.clientId
  if (input.projectId !== undefined) update.project_id = input.projectId
  if (input.avatarMediaId !== undefined) update.avatar_media_id = input.avatarMediaId
  if (input.source !== undefined) update.source = input.source || null
  if (input.sourceUrl !== undefined) update.source_url = input.sourceUrl || null
  if (input.permissionToShow !== undefined) update.permission_to_show = input.permissionToShow
  if (input.featured !== undefined) update.featured = input.featured
  if (input.orderIndex !== undefined) update.order_index = input.orderIndex
  if (input.status !== undefined) update.status = input.status

  const { data, error } = await supabase
    .from('testimonials')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Testimonial not found' })
  }

  return data
})
