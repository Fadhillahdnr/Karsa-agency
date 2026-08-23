import { requireAdminUser } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ProjectUpdate } from '../../../utils/supabase'
import { projectUpdateSchema } from '../../../validation/project'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project id' })
  }

  const body = await readBody(event)
  const parsed = projectUpdateSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: parsed.error.flatten() })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: ProjectUpdate = {}
  if (input.slug !== undefined) update.slug = input.slug
  if (input.title !== undefined) update.title = input.title
  if (input.year !== undefined) update.year = input.year
  if (input.type !== undefined) update.type = input.type
  if (input.category !== undefined) update.category = input.category
  if (input.services !== undefined) update.services = input.services
  if (input.description !== undefined) update.description = input.description
  if (input.cover !== undefined) update.cover = input.cover
  if (input.featured !== undefined) update.featured = input.featured
  if (input.challenge !== undefined) update.challenge = input.challenge || null
  if (input.approach !== undefined) update.approach = input.approach || null
  if (input.outcome !== undefined) update.outcome = input.outcome || null
  if (input.order !== undefined) update.order_index = input.order
  if (input.published !== undefined) update.published = input.published

  const { data, error } = await supabase
    .from('projects')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A project with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
