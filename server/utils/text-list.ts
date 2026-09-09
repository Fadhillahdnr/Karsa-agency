/**
 * Fields like service_translations.who_its_for are stored as newline-joined
 * text (see supabase/migrations/0008_create_services.sql) rather than a
 * separate child table, since they're always short, ordered bullet lists.
 * These two helpers are the only place that join/split happens.
 */
export function joinList(items: string[] | undefined): string | null {
  if (!items || !items.length) return null
  return items.filter(Boolean).join('\n')
}

export function splitList(text: string | null): string[] {
  if (!text) return []
  return text.split('\n').filter(Boolean)
}
