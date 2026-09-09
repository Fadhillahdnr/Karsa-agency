import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { careerSchema } from '../../../validation/career'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = careerSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: career, error: insertError } = await supabase
    .from('careers')
    .insert({
      slug: input.slug,
      department: input.department || null,
      employment_type: input.employmentType || null,
      location: input.location || null,
      work_mode: input.workMode || null,
      application_url: input.applicationUrl || null,
      application_email: input.applicationEmail || null,
      order_index: input.orderIndex,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : (input.publishedAt ?? null),
      closing_at: input.closingAt ?? null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select('*')
    .single()

  if (insertError || !career) {
    if (insertError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A career listing with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create career listing' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    career_id: career.id,
    locale,
    title: input.translations[locale].title,
    summary: input.translations[locale].summary || null,
    responsibilities: input.translations[locale].responsibilities,
    requirements: input.translations[locale].requirements,
    nice_to_have: input.translations[locale].niceToHave,
    seo_title: input.translations[locale].seoTitle || null,
    seo_description: input.translations[locale].seoDescription || null,
  }))

  await supabase.from('career_translations').insert(translationRows)

  setResponseStatus(event, 201)
  return career
})
