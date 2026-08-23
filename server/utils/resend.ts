import { Resend } from 'resend'

let client: Resend | null = null

/** Server-only Resend client. Returns null when RESEND_API_KEY isn't configured. */
export function getResendClient() {
  const config = useRuntimeConfig()

  if (!config.resendApiKey) {
    return null
  }

  if (!client) {
    client = new Resend(config.resendApiKey)
  }

  return client
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface InternalNotificationInput {
  referenceId: string
  name: string
  company?: string
  email: string
  phone?: string
  service: string
  budgetRange?: string
  timeline?: string
  projectDescription: string
  submittedAt: string
}

export function buildInternalNotificationEmail(input: InternalNotificationInput) {
  const subject = `New Project Inquiry — ${escapeHtml(input.company || input.name)}`
  const rows: [string, string | undefined][] = [
    ['Name', input.name],
    ['Company', input.company],
    ['Email', input.email],
    ['Phone', input.phone],
    ['Service', input.service],
    ['Budget', input.budgetRange],
    ['Timeline', input.timeline],
    ['Reference ID', input.referenceId],
    ['Submitted At', input.submittedAt],
  ]

  const rowsHtml = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#71717A;">${label}</td><td>${escapeHtml(String(value))}</td></tr>`)
    .join('')

  const html = `
    <div style="font-family:sans-serif;color:#0B0B0B;">
      <h2>New Project Inquiry</h2>
      <table>${rowsHtml}</table>
      <p style="margin-top:16px;color:#71717A;">Description</p>
      <p>${escapeHtml(input.projectDescription)}</p>
    </div>
  `

  return { subject, html }
}

interface ConfirmationEmailInput {
  name: string
  referenceId: string
}

export function buildConfirmationEmail(input: ConfirmationEmailInput) {
  const subject = 'We received your project inquiry — Karsa Studio'
  const html = `
    <div style="font-family:sans-serif;color:#0B0B0B;">
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Terima kasih telah menghubungi Karsa Studio.</p>
      <p>Kami sudah menerima informasi awal mengenai project Anda.</p>
      <p>Reference:<br><strong>${escapeHtml(input.referenceId)}</strong></p>
      <p>Karsa Studio<br>Dari Karsa Menjadi Karya.</p>
    </div>
  `

  return { subject, html }
}
