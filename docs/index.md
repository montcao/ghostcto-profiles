# Documentation index

Every tracked Markdown document outside `skills/` and `plugins/`, which hold profile content checked by `scripts/validate.mjs`. `npm run docs:check` fails when a document is missing here or its review date is older than 90 days.

**Reviewed** means one of two things:

- **read**: someone checked the document claim by claim against the repository on that date
- **edited**: only the date of its last commit; nobody has verified it

Rows start as "edited". Only a gardening pass (`.claude/agents/doc-gardener.md`) upgrades a row to "read".

| Document | Kind | What it decides | Reviewed |
| --- | --- | --- | --- |
| [AGENTS.md](../AGENTS.md) | entry point | Rules, commands, claim protocol, when to stop and ask, where things live | Reviewed: 2026-11-05 (edited) |
| [CLAUDE.md](../CLAUDE.md) | pointer | Points Claude Code to AGENTS.md | Reviewed: 2026-11-05 (edited) |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | architecture | Synced vs owned paths, generated plugin, profile contract, release flow, and the check for each | Reviewed: 2026-11-05 (edited) |
| [README.md](../README.md) | user guide (synced) | How to install profiles and the plugin; the profile catalog | Reviewed: 2026-11-04 (edited) |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | policy | Profile scope rules and commit conventions | Reviewed: 2026-11-05 (edited) |
| [SECURITY.md](../SECURITY.md) | policy | What profiles do not guarantee, and how to report vulnerabilities | Reviewed: 2026-09-19 (edited) |
| [agent-readiness.md](audits/agent-readiness.md) | audit | Agent-readiness verdicts per principle as of 2026-11-05, and the order of work | Reviewed: 2026-11-05 (edited) |
| [tech-debt.md](plans/tech-debt.md) | plan | Known gaps, open decisions, and what would close each | Reviewed: 2026-11-05 (edited) |
| [reviewer.md](../.claude/agents/reviewer.md) | agent prompt | How a branch is reviewed against this repository's rules | Reviewed: 2026-11-05 (edited) |
| [doc-gardener.md](../.claude/agents/doc-gardener.md) | agent prompt | How documents are checked against the repository and dates upgraded | Reviewed: 2026-11-05 (edited) |
