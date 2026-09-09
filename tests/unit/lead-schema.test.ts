import { describe, expect, it } from 'vitest'
import { leadNoteSchema, leadStatusUpdateSchema, leadUpdateSchema } from '../../server/validation/lead'

describe('leadStatusUpdateSchema', () => {
  it('accepts every status in the pipeline', () => {
    for (const status of ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'won', 'lost', 'archived']) {
      expect(leadStatusUpdateSchema.safeParse({ status }).success).toBe(true)
    }
  })

  it('rejects an unknown status', () => {
    expect(leadStatusUpdateSchema.safeParse({ status: 'closed' }).success).toBe(false)
  })
})

describe('leadUpdateSchema', () => {
  it('accepts a partial update with just one field', () => {
    expect(leadUpdateSchema.safeParse({ priority: 'high' }).success).toBe(true)
  })

  it('accepts an empty object (no-op update)', () => {
    expect(leadUpdateSchema.safeParse({}).success).toBe(true)
  })

  it('rejects an invalid priority', () => {
    expect(leadUpdateSchema.safeParse({ priority: 'urgent' }).success).toBe(false)
  })

  it('accepts assignedTo as null to unassign', () => {
    const result = leadUpdateSchema.safeParse({ assignedTo: null })
    expect(result.success).toBe(true)
  })

  it('rejects a non-UUID assignedTo', () => {
    expect(leadUpdateSchema.safeParse({ assignedTo: 'not-a-uuid' }).success).toBe(false)
  })

  it('rejects a non-ISO nextFollowUpAt', () => {
    expect(leadUpdateSchema.safeParse({ nextFollowUpAt: '2026-06-15' }).success).toBe(false)
  })

  it('accepts a full ISO datetime for nextFollowUpAt', () => {
    expect(leadUpdateSchema.safeParse({ nextFollowUpAt: '2026-06-15T00:00:00.000Z' }).success).toBe(true)
  })
})

describe('leadNoteSchema', () => {
  it('rejects an empty note', () => {
    expect(leadNoteSchema.safeParse({ note: '' }).success).toBe(false)
  })

  it('rejects a note over 4000 characters', () => {
    expect(leadNoteSchema.safeParse({ note: 'a'.repeat(4001) }).success).toBe(false)
  })

  it('accepts a normal note and trims whitespace', () => {
    const result = leadNoteSchema.safeParse({ note: '  Called, will follow up Friday.  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.note).toBe('Called, will follow up Friday.')
  })
})
