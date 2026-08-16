/**
 * Scoped stylesheet for the budget tab. Standalone client bundles cannot use
 * the in-repo CSS-module pipeline, so the sheet ships as a string and is
 * installed effect-scoped into a `<style data-dsh-budget>` element. Every
 * selector is scoped under `[data-dsh-budget]` and uses theme design tokens
 * only, so it follows both color schemes.
 *
 * @module dsh-budget/client/styles
 */

/** One `<style>` installation; returns the exact disposer that removes it. */
export function installBudgetStyles(): () => void {
  const existing = document.querySelector('style[data-dsh-budget]')
  if (existing !== null) return () => {}
  const element = document.createElement('style')
  element.dataset.dshBudget = ''
  element.textContent = BUDGET_CSS
  document.head.append(element)
  return () => { element.remove() }
}

/** The budget stylesheet, scoped and token-driven. */
const BUDGET_CSS = `
[data-dsh-budget] .dbud-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
[data-dsh-budget] .dbud-heading {
  margin: 4px 0 0;
  font-size: 1em;
  color: var(--dsw-alias-label-primary);
}
[data-dsh-budget] .dbud-status {
  color: var(--dsw-alias-label-secondary);
  margin: 0;
}
[data-dsh-budget] .dbud-failure {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
[data-dsh-budget] .dbud-failure button,
[data-dsh-budget] .dbud-action {
  font: inherit;
  cursor: pointer;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 4px;
  padding: 4px 10px;
}
[data-dsh-budget] .dbud-failure-detail {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
}
[data-dsh-budget] .dbud-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}
[data-dsh-budget] .dbud-row {
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
[data-dsh-budget] .dbud-row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
[data-dsh-budget] .dbud-row-title {
  color: var(--dsw-alias-label-primary);
}
[data-dsh-budget] .dbud-row-meta {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.9em;
  overflow-wrap: anywhere;
}
[data-dsh-budget] .dbud-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
[data-dsh-budget] .dbud-bar-fill {
  height: 100%;
  background: var(--dsw-alias-brand-primary);
}
[data-dsh-budget] .dbud-bar-fill[data-tone='warn'] {
  background: var(--dsw-alias-state-warn-primary);
}
[data-dsh-budget] .dbud-bar-fill[data-tone='over'] {
  background: var(--dsw-alias-state-error-primary);
}
[data-dsh-budget] .dbud-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.85em;
  white-space: nowrap;
  border: 1px solid currentColor;
  color: var(--dsw-alias-state-error-primary);
}
[data-dsh-budget] .dbud-models {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
[data-dsh-budget] .dbud-models li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
[data-dsh-budget] .dbud-model-name {
  color: var(--dsw-alias-label-primary);
}
[data-dsh-budget] .dbud-model-meta {
  color: var(--dsw-alias-label-secondary);
  font-size: 0.9em;
}
[data-dsh-budget] .dbud-alerts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
[data-dsh-budget] .dbud-alert {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--dsw-alias-label-secondary);
  font-size: 0.9em;
}
[data-dsh-budget] .dbud-alert[data-kind='over'] {
  color: var(--dsw-alias-state-error-primary);
}
[data-dsh-budget] .dbud-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  padding: 12px;
}
[data-dsh-budget] .dbud-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9em;
  color: var(--dsw-alias-label-secondary);
}
[data-dsh-budget] .dbud-field input {
  font: inherit;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 4px;
  padding: 4px 8px;
  max-width: 220px;
}
[data-dsh-budget] .dbud-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  color: var(--dsw-alias-label-secondary);
}
[data-dsh-budget] .dbud-notice {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
  font-size: 0.9em;
}
`
