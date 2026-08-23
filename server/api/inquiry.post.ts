import { inquirySchema } from '../validation/inquiry'
import { verifyTurnstileToken } from '../utils/turnstile'
import { isRateLimited } from '../utils/rate-limit'
import { getSupabaseClient } from '../utils/supabase'
import { getResendClient, buildInternalNotificationEmail, buildConfirmationEmail } from '../utils/resend'

type InquiryResponse
  = | { success: true, referenceId: string }
    | { success: false, code: string, message: string }

function generateReferenceId() {
  const random = (crypto.randomUUID().split('-')[0] ?? crypto.randomUUID().slice(0, 8)).toUpperCase()
  return `KRS-${random}`
}

export default defineEventHandler(async (event): Promise<InquiryResponse> => {
  const body = await readBody(event)
  const parsed = inquirySchema.safeParse(body)

  if (!parsed.success) {
    setResponseStatus(event, 422)
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Please check the highlighted fields and try again.',
    }
  }

  const input = parsed.data

  const turnstileResult = await verifyTurnstileToken(input.turnstileToken || '', getRequestIP(event, { xForwardedFor: true }))
  if (turnstileResult.configured && !turnstileResult.success) {
    setResponseStatus(event, 400)
    return {
      success: false,
      code: 'VERIFICATION_FAILED',
      message: 'We couldn\'t verify your submission. Please refresh and try again.',
    }
  }

  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (isRateLimited(clientIp)) {
    setResponseStatus(event, 429)
    return {
      success: false,
      code: 'RATE_LIMITED',
      message: 'Too many submissions. Please try again later.',
    }
  }

  const referenceId = generateReferenceId()
  const submittedAt = new Date().toISOString()

  const supabase = getSupabaseClient()
  if (supabase) {
    const { error } = await supabase.from('leads').insert({
      reference_id: referenceId,
      name: input.name,
      company: input.company || null,
      email: input.email,
      phone: input.phone || null,
      service: input.service,
      budget_range: input.budgetRange || null,
      timeline: input.timeline || null,
      project_description: input.projectDescription,
      referral_source: input.referralSource || null,
      source: 'website',
    })

    if (error) {
      setResponseStatus(event, 500)
      return {
        success: false,
        code: 'STORAGE_ERROR',
        message: 'We couldn\'t save your inquiry right now. Please try again shortly.',
      }
    }
  }
  else {
    // TODO: business input — Supabase isn't configured (SUPABASE_URL /
    // SUPABASE_SERVICE_ROLE_KEY missing). The inquiry is still emailed
    // below, but nothing is persisted until Supabase is connected.
    console.warn('[inquiry] Supabase not configured — skipping lead storage.')
  }

  const resend = getResendClient()
  if (resend) {
    const config = useRuntimeConfig()

    if (config.karsaInquiryEmail && config.resendFromEmail) {
      const internal = buildInternalNotificationEmail({
        referenceId,
        name: input.name,
        company: input.company,
        email: input.email,
        phone: input.phone,
        service: input.service,
        budgetRange: input.budgetRange,
        timeline: input.timeline,
        projectDescription: input.projectDescription,
        submittedAt,
      })

      await resend.emails.send({
        from: config.resendFromEmail,
        to: config.karsaInquiryEmail,
        subject: internal.subject,
        html: internal.html,
      }).catch(error => console.error('[inquiry] failed to send internal notification', error))
    }

    if (config.resendFromEmail) {
      const confirmation = buildConfirmationEmail({ name: input.name, referenceId })

      await resend.emails.send({
        from: config.resendFromEmail,
        to: input.email,
        subject: confirmation.subject,
        html: confirmation.html,
      }).catch(error => console.error('[inquiry] failed to send confirmation email', error))
    }
  }
  else {
    // TODO: business input — RESEND_API_KEY isn't configured. Emails are
    // skipped; the lead is still stored above (when Supabase is configured).
    console.warn('[inquiry] Resend not configured — skipping email notifications.')
  }

  return { success: true, referenceId }
})
