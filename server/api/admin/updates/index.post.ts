import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { companyUpdateSchema } from '../../../validation/company-update'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = companyUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: update, error: insertError } = await supabase
    .from('company_updates')
    .insert({
      slug: input.slug,
      cover_media_id: input.coverMediaId ?? null,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : (input.publishedAt ?? null),
      created_by: user.id,
      updated_by: user.id,
    })
    .select('*')
    .single()

  if (insertError || !update) {
    if (insertError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'An update with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create update' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    update_id: update.id,
    locale,
    title: input.translations[locale].title,
    excerpt: input.translations[locale].excerpt || null,
    content: input.translations[locale].content,
    seo_title: input.translations[locale].seoTitle || null,
    seo_description: input.translations[locale].seoDescription || null,
  }))

  await supabase.from('company_update_translations').insert(translationRows)

  setResponseStatus(event, 201)
  return update
})
