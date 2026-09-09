import { describe, expect, it } from 'vitest'
import {
  leadPriorities,
  leadPriorityLabel,
  leadPriorityTone,
  leadStatuses,
  leadStatusLabel,
  leadStatusTone,
} from '../../app/utils/leads'

describe('lead status/priority lookup completeness', () => {
  it('every status has a label and a tone', () => {
    for (const status of leadStatuses) {
      expect(leadStatusLabel[status], `missing label for "${status}"`).toBeTruthy()
      expect(leadStatusTone[status], `missing tone for "${status}"`).toBeTruthy()
    }
  })

  it('every priority has a label and a tone', () => {
    for (const priority of leadPriorities) {
      expect(leadPriorityLabel[priority], `missing label for "${priority}"`).toBeTruthy()
      expect(leadPriorityTone[priority], `missing tone for "${priority}"`).toBeTruthy()
    }
  })

  it('the pipeline order matches the master prompt §138 flow', () => {
    // new -> contacted -> qualified -> discovery -> proposal -> won/lost -> archived
    expect(leadStatuses).toEqual([
      'new',
      'contacted',
      'qualified',
      'discovery',
      'proposal',
      'won',
      'lost',
      'archived',
    ])
  })

  it('terminal/at-risk statuses use a distinct tone from active ones', () => {
    expect(leadStatusTone.won).toBe('accent')
    expect(leadStatusTone.lost).toBe('danger')
    expect(leadStatusTone.new).not.toBe(leadStatusTone.archived)
  })
})
