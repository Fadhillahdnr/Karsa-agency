interface ZodFlatten {
  formErrors?: string[]
  fieldErrors?: Record<string, string[] | undefined>
}

interface ApiErrorBody {
  statusMessage?: string
  message?: string
  data?: ZodFlatten
}

/**
 * `server/api/admin/projects/*` returns Zod's `flatten()` shape in the error
 * `data` on 422s (see server/validation/project.ts). ofetch only exposes
 * `statusMessage` by default, which is the generic "Validation failed" —
 * this pulls out the actual per-field reasons so the admin form can show
 * why a save failed instead of just that it failed.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { data?: ApiErrorBody })?.data

  const fieldErrors = data?.data?.fieldErrors
  if (fieldErrors) {
    const messages = Object.entries(fieldErrors)
      .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].length > 0)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)

    if (messages.length > 0) return messages.join(' · ')
  }

  const formErrors = data?.data?.formErrors
  if (formErrors && formErrors.length > 0) return formErrors.join(' · ')

  return data?.statusMessage || data?.message || fallback
}
