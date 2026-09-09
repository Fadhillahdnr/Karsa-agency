export interface InquiryFormState {
  service: string
  selectedPackageId: string | null
  projectDescription: string
  budgetRange: string
  timeline: string
  name: string
  email: string
  company: string
  phone: string
  preferredContact: string
  referralSource: string
  consentPrivacy: boolean
}

export function createEmptyInquiryForm(): InquiryFormState {
  return {
    service: '',
    selectedPackageId: null,
    projectDescription: '',
    budgetRange: '',
    timeline: '',
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredContact: '',
    referralSource: '',
    consentPrivacy: false,
  }
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

/** Captured once per form mount — not user-facing fields, sent alongside the form. */
function captureAttribution() {
  if (import.meta.server) {
    return { sourcePage: '', utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '', utmTerm: '' }
  }

  const params = new URLSearchParams(window.location.search)
  return {
    sourcePage: document.referrer || window.location.pathname,
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
  }
}

export function useProjectInquiry() {
  const status = ref<SubmitStatus>('idle')
  const errorMessage = ref('')
  const referenceId = ref('')

  const { track } = useAnalytics()
  const { locale } = useI18n()
  const attribution = captureAttribution()

  async function submit(form: InquiryFormState, turnstileToken: string) {
    status.value = 'submitting'
    errorMessage.value = ''

    try {
      const response = await $fetch<
        { success: true, referenceId: string } | { success: false, code: string, message: string }
      >('/api/inquiry', {
        method: 'POST',
        body: { ...form, ...attribution, locale: locale.value, turnstileToken },
      })

      if (response.success) {
        status.value = 'success'
        referenceId.value = response.referenceId
        track('inquiry_submit_success', { service: form.service })
      }
      else {
        status.value = 'error'
        errorMessage.value = response.message
        track('inquiry_submit_error', { code: response.code })
      }
    }
    catch (error) {
      status.value = 'error'
      // $fetch throws on non-2xx responses; ofetch attaches the parsed JSON
      // body to error.data, which is where our API's error message lives.
      const data = (error as { data?: { message?: string, code?: string } })?.data
      errorMessage.value = data?.message
        || 'We couldn\'t send your project inquiry. Your form is still here — please try again.'
      track('inquiry_submit_error', { code: data?.code || 'NETWORK_ERROR' })
    }
  }

  function reset() {
    status.value = 'idle'
    errorMessage.value = ''
    referenceId.value = ''
  }

  return {
    status: readonly(status),
    errorMessage: readonly(errorMessage),
    referenceId: readonly(referenceId),
    submit,
    reset,
  }
}
