/**
 * Host-line gate: from harness 0.1.2-alpha.1 the session read path refuses
 * logs containing event types outside the harness-known vocabulary, so
 * budget/alert + budget/block appends are suppressed there. Earlier lines
 * (published rc.2 included) keep the legacy write behavior. The decision is
 * a pure function of the installed dsh-session version so both sides
 * regress without faking the runtime package.
 *
 * @module dsh-budget/test/audit-gate.spec
 */

import { describe, expect, it } from 'vitest'
import { auditAppendsAllowed } from '../src/events.ts'

describe('audit event host-line gate', () => {
  it('writes on legacy host lines (rc.2 and earlier)', () => {
    expect(auditAppendsAllowed('0.1.1-rc.2')).toBe(true)
    expect(auditAppendsAllowed('0.1.0-rc.8')).toBe(true)
    expect(auditAppendsAllowed(undefined)).toBe(true)
  })

  it('suppresses from 0.1.2-alpha.1 on', () => {
    expect(auditAppendsAllowed('0.1.2-alpha.1')).toBe(false)
    expect(auditAppendsAllowed('0.1.2')).toBe(false)
    expect(auditAppendsAllowed('0.2.0')).toBe(false)
  })

  it('stays open for unparseable versions (unknown host lines)', () => {
    expect(auditAppendsAllowed('dev-build')).toBe(true)
  })
})
