import { describe, expect, it } from 'vitest'
import { inquirySchema } from '../../server/validation/inquiry'

const validPayload = {
  name: 'Jane Doe',
  company: 'Acme Inc',
  email: 'jane@example.com',
  phone: '+62 812 0000 0000',
  service: 'website',
  budgetRange: 'Rp10m – Rp25m',
  timeline: '1–2 months',
  projectDescription: 'We need a new company profile website with a contact form and blog.',
  referralSource: 'Google',
  turnstileToken: 'test-token',
}

describe('inquirySchema', () => {
  it('accepts a fully valid payload', () => {
    const result = inquirySchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('accepts a payload with only required fields', () => {
    const result = inquirySchema.safeParse({
      name: 'Jo',
      email: 'jo@example.com',
      service: 'other',
      projectDescription: 'A short but sufficiently long project description for validation.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    const result = inquirySchema.safeParse({ ...validPayload, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = inquirySchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown service value', () => {
    const result = inquirySchema.safeParse({ ...validPayload, service: 'not-a-service' })
    expect(result.success).toBe(false)
  })

  it('rejects a project description shorter than 30 characters', () => {
    const result = inquirySchema.safeParse({ ...validPayload, projectDescription: 'too short' })
    expect(result.success).toBe(false)
  })

  it('rejects a project description over 5000 characters', () => {
    const result = inquirySchema.safeParse({ ...validPayload, projectDescription: 'a'.repeat(5001) })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from the name', () => {
    const result = inquirySchema.safeParse({ ...validPayload, name: '  Jane Doe  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe('Jane Doe')
  })
})
