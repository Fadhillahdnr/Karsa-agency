import { requireAdminUser } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { projectSchema } from '../../../validation/project'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = await readBody(event)
  const parsed = projectSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: parsed.error.flatten() })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const { data, error } = await supabase
    .from('projects')
    .insert({
      slug: input.slug,
      title: input.title,
      year: input.year,
      type: input.type,
      category: input.category,
      services: input.services,
      description: input.description,
      cover: input.cover,
      featured: input.featured,
      challenge: input.challenge || null,
      approach: input.approach || null,
      outcome: input.outcome || null,
      live_url: input.liveUrl || null,
      github_url: input.githubUrl || null,
      order_index: input.order,
      published: input.published,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A project with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  setResponseStatus(event, 201)
  return data
})
