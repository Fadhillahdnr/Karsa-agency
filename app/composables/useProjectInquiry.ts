export interface InquiryFormState {
  name: string
  email: string
  company: string
  phone: string
  service: string
  budgetRange: string
  timeline: string
  projectDescription: string
  referralSource: string
}

export function createEmptyInquiryForm(): InquiryFormState {
  return {
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budgetRange: '',
    timeline: '',
    projectDescription: '',
    referralSource: '',
  }
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export function useProjectInquiry() {
  const status = ref<SubmitStatus>('idle')
  const errorMessage = ref('')
  const referenceId = ref('')

  const { track } = useAnalytics()

  async function submit(form: InquiryFormState, turnstileToken: string) {
    status.value = 'submitting'
    errorMessage.value = ''

    try {
      const response = await $fetch<
        { success: true, referenceId: string } | { success: false, code: string, message: string }
      >('/api/inquiry', {
        method: 'POST',
        body: { ...form, turnstileToken },
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
