# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

Report privately through GitHub's private vulnerability reporting:

**https://github.com/PerryLink/dsh-budget/security/advisories/new**

That flow keeps the report confidential while we triage, and it is the channel we watch first.

## Before you report

- **Redact sensitive data** from any logs, session excerpts, or config files you attach: tokens, API keys, secrets, webhook URLs with credentials, Authorization headers, personal paths, and account identifiers.
- Include, when possible: the plugin version, the harness (`dsh`) version, Node and OS versions, and the minimal steps to reproduce.

## What to expect

- **Acknowledgment**: within 5 business days.
- **Triage**: within 10 business days we confirm the issue and assess severity, or ask for more details.
- **Fix**: security fixes are prepared in a private fork, released as a patch version, and announced in the release notes.

## Disclosure and credit

- We follow coordinated disclosure: a public advisory (and CVE request where appropriate) is published once a fix ships.
- Reporters are credited in the advisory unless they ask to remain anonymous. There is no bug bounty program at this time.

## Scope

This plugin meters and budgets the harness's model usage. Its own guarantees:

- The only network call the plugin can make is the configured threshold-alert webhook; the URL is validated at load, sanitized (credentials dropped) before any log line, and requests are timeout-bounded and fire-and-forget.
- Everything shown to the model or written to the session log is sanitized; the audit events carry amounts and scope names only — never prompts, payloads, or credentials.
- Budget blocks manifest as a corrective error finish on the `llm/stream` waterfall; the plugin never fabricates model output and never rewrites loop-built requests.

Vulnerabilities in the harness itself should be reported to the official harness maintainers instead.
