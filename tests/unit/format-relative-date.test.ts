import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatRelativeDate } from '../../app/utils/leads'

const NOW = new Date('2026-06-15T12:00:00.000Z')

describe('formatRelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows "Just now" for timestamps under 30 seconds old (rounds to 0 minutes)', () => {
    expect(formatRelativeDate(new Date(NOW.getTime() - 10_000).toISOString())).toBe('Just now')
  })

  it('shows minutes for under an hour', () => {
    expect(formatRelativeDate(new Date(NOW.getTime() - 5 * 60_000).toISOString())).toBe('5m ago')
  })

  it('shows hours for under a day', () => {
    expect(formatRelativeDate(new Date(NOW.getTime() - 3 * 60 * 60_000).toISOString())).toBe('3h ago')
  })

  it('shows days for under a week', () => {
    expect(formatRelativeDate(new Date(NOW.getTime() - 2 * 24 * 60 * 60_000).toISOString())).toBe('2d ago')
  })

  it('falls back to a formatted date for a week or older', () => {
    const eightDaysAgo = new Date(NOW.getTime() - 8 * 24 * 60 * 60_000).toISOString()
    expect(formatRelativeDate(eightDaysAgo)).toBe('Jun 7, 2026')
  })
})
