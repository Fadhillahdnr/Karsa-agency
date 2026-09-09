import { describe, expect, it } from 'vitest'
import { estimateReadingTime } from '../../server/utils/reading-time'

function paragraph(text: string) {
  return { type: 'paragraph', content: [{ type: 'text', text }] }
}

describe('estimateReadingTime', () => {
  it('returns at least 1 minute for empty or near-empty content', () => {
    expect(estimateReadingTime({})).toBe(1)
    expect(estimateReadingTime({ type: 'doc', content: [paragraph('Hi')] })).toBe(1)
  })

  it('rounds to the nearest minute at ~200 words/minute', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ')
    const content = { type: 'doc', content: [paragraph(words)] }
    expect(estimateReadingTime(content)).toBe(2)
  })

  it('extracts text recursively across nested nodes (headings, lists, etc.)', () => {
    const words300 = Array.from({ length: 300 }, (_, i) => `w${i}`).join(' ')
    const content = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Title' }] },
        {
          type: 'bulletList',
          content: [
            { type: 'listItem', content: [paragraph(words300)] },
          ],
        },
      ],
    }
    // ~301 words (heading + list) / 200 rounds to 2.
    expect(estimateReadingTime(content)).toBe(2)
  })

  it('handles nodes with no text gracefully', () => {
    const content = { type: 'doc', content: [{ type: 'horizontalRule' }] }
    expect(estimateReadingTime(content)).toBe(1)
  })
})
