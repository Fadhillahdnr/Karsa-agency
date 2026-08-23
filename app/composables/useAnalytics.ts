type AnalyticsEvent
  = | 'cta_start_project'
    | 'cta_view_work'
    | 'project_view'
    | 'service_view'
    | 'inquiry_start'
    | 'inquiry_submit_success'
    | 'inquiry_submit_error'

/**
 * Thin wrapper around gtag. No-ops when NUXT_PUBLIC_GA_MEASUREMENT_ID isn't
 * configured (see TODO: business input in .env.example). Never pass email,
 * phone, or project description as event params.
 */
export function useAnalytics() {
  function track(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
    if (import.meta.server) return
    const gtag = window.gtag
    if (typeof gtag !== 'function') return
    gtag('event', event, params)
  }

  return { track }
}
