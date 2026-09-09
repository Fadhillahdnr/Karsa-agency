import { describe, expect, it } from 'vitest'
import { legalPageUpdateSchema } from '../../server/validation/legal-page'

describe('legalPageUpdateSchema', () => {
  it('accepts an update to a single locale only', () => {
    const result = legalPageUpdateSchema.safeParse({
      translations: { en: { title: 'Privacy Policy' } },
    })
    expect(result.success).toBe(true)
  })

  it('accepts content as an arbitrary TipTap JSON object', () => {
    const result = legalPageUpdateSchema.safeParse({
      translations: {
        en: { content: { type: 'doc', content: [] } },
      },
    })
    expect(result.success).toBe(true)
  })

  it('rejects a title shorter than 2 characters', () => {
    const result = legalPageUpdateSchema.safeParse({
      translations: { en: { title: 'P' } },
    })
    expect(result.success).toBe(false)
  })

  it('requires the translations key itself (slug is never editable)', () => {
    expect(legalPageUpdateSchema.safeParse({}).success).toBe(false)
  })
})
