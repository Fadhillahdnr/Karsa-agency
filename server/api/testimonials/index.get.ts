import { getSupabaseClient } from '../../utils/supabase'

export type TestimonialApiItem = {
  quote: string
  personName: string
  personRole: string | null
  company: string | null
  avatarUrl: string | null
  featured: boolean
}

type Row = {
  quote: string
  person_name: string
  person_role: string | null
  company: string | null
  featured: boolean
  avatar: { secure_url: string | null, url: string } | null
}

/** Published testimonials with explicit permission_to_show only (§16) — never published without it. */
export default defineEventHandler(async (): Promise<TestimonialApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('testimonials')
    .select('quote, person_name, person_role, company, featured, avatar:media_assets!testimonials_avatar_media_id_fkey(secure_url, url)')
    .eq('status', 'published')
    .eq('permission_to_show', true)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return (data as unknown as Row[]).map(item => ({
    quote: item.quote,
    personName: item.person_name,
    personRole: item.person_role,
    company: item.company,
    avatarUrl: item.avatar ? (item.avatar.secure_url || item.avatar.url) : null,
    featured: item.featured,
  }))
})
