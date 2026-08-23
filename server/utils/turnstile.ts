const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface TurnstileVerifyResult {
  success: boolean
  configured: boolean
}

/**
 * Verifies a Turnstile token server-side. If TURNSTILE_SECRET_KEY isn't
 * configured yet, verification is skipped and reported as `configured: false`
 * so the caller can decide how strict to be (see TODO: business input).
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<TurnstileVerifyResult> {
  const config = useRuntimeConfig()

  if (!config.turnstileSecretKey) {
    return { success: true, configured: false }
  }

  if (!token) {
    return { success: false, configured: true }
  }

  try {
    const body = new URLSearchParams({ secret: config.turnstileSecretKey, response: token })
    if (remoteIp) body.set('remoteip', remoteIp)

    const result = await $fetch<{ success: boolean }>(VERIFY_URL, {
      method: 'POST',
      body,
    })

    return { success: result.success, configured: true }
  }
  catch {
    return { success: false, configured: true }
  }
}
