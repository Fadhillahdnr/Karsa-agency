import { describe, expect, it } from 'vitest'
import { careerSchema, careerUpdateSchema } from '../../server/validation/career'

const validTranslation = {
  title: 'Product Designer',
  summary: 'Own end-to-end product design across web and app.',
  responsibilities: ['Design flows', 'Run user research'],
  requirements: ['3+ years product design experience'],
  niceToHave: ['Motion design background'],
}

const validPayload = {
  slug: 'product-designer',
  department: 'Design',
  employmentType: 'Full-time',
  location: 'Jakarta',
  workMode: 'Hybrid',
  status: 'draft' as const,
  translations: { en: validTranslation, id: validTranslation },
}

describe('careerSchema', () => {
  it('accepts a fully valid payload', () => {
    expect(careerSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a slug with uppercase or spaces', () => {
    expect(careerSchema.safeParse({ ...validPayload, slug: 'Product Designer' }).success).toBe(false)
  })

  it('rejects a missing translations object', () => {
    const { translations: _translations, ...rest } = validPayload
    expect(careerSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects an invalid application URL', () => {
    expect(careerSchema.safeParse({ ...validPayload, applicationUrl: 'not-a-url' }).success).toBe(false)
  })

  it('rejects an invalid application email', () => {
    expect(careerSchema.safeParse({ ...validPayload, applicationEmail: 'not-an-email' }).success).toBe(false)
  })

  it('defaults status to draft and orderIndex to 0 when omitted', () => {
    const { status: _status, ...rest } = validPayload
    const result = careerSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('draft')
      expect(result.data.orderIndex).toBe(0)
    }
  })
})

describe('careerUpdateSchema', () => {
  it('accepts a partial update touching only status', () => {
    expect(careerUpdateSchema.safeParse({ status: 'published' }).success).toBe(true)
  })

  it('accepts a partial translation update for a single locale', () => {
    const result = careerUpdateSchema.safeParse({
      translations: { en: { title: 'Senior Product Designer' } },
    })
    expect(result.success).toBe(true)
  })

  it('still rejects an invalid status even in a partial update', () => {
    expect(careerUpdateSchema.safeParse({ status: 'closed' }).success).toBe(false)
  })
})
