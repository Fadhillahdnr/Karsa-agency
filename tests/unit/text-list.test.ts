import { describe, expect, it } from 'vitest'
import { joinList, splitList } from '../../server/utils/text-list'

describe('joinList / splitList', () => {
  it('splitList returns an empty array for null or empty input', () => {
    expect(splitList(null)).toEqual([])
    expect(splitList('')).toEqual([])
  })

  it('splitList splits on newlines and drops empty lines', () => {
    expect(splitList('one\ntwo\n\nthree')).toEqual(['one', 'two', 'three'])
  })

  it('joinList returns null for undefined or empty arrays', () => {
    expect(joinList(undefined)).toBeNull()
    expect(joinList([])).toBeNull()
  })

  it('joinList filters out falsy entries and joins with newlines', () => {
    expect(joinList(['one', '', 'two'])).toBe('one\ntwo')
  })

  it('round-trips through join then split', () => {
    const items = ['Alpha', 'Beta', 'Gamma']
    expect(splitList(joinList(items))).toEqual(items)
  })
})
