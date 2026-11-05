# Agent readiness audit

Date: 2026-11-05. Revision audited: `b3984c8` (`main`, release v1.3.0).
Method: `ghostcto-harness-engineer` phase 1. This audit only reads; it changed nothing except adding this file.

## Context that shapes every finding

This repository is downstream of a private source repository. A one-way sync opens a pull request here whenever the source changes. The sync owns these paths and overwrites them:

- `README.md`, `LICENSE`, `NOTICE`
- `skills/**`, `assets/**`
- `plugins/ghostcto/**`, `.claude-plugin/marketplace.json`

This repository owns everything else: `CONTRIBUTING.md`, `SECURITY.md`, `package.json`, `.releaserc.json`, `scripts/validate.mjs`, `.github/**`, and any new file such as `AGENTS.md` or `docs/`.

A change to a managed path made here is lost at the next sync. **Nothing in this repository says so.**

## Finding 0: duplicate skills (regression, user-visible)

The `validate` job on `b3984c8` ran `npx skills@1.7.0 add . --list`. It reported `Found 24 skills`: the 12 `ghostcto-*` skills, plus 12 unprefixed copies from `plugins/ghostcto/skills/` (`developer`, `security`, …). Anyone running `npx skills add montcao/ghostcto-profiles` without `--skill` now sees each profile twice.

The generated Claude Code plugin introduced this in v1.3.0. CI passed because nothing asserts the discovered count.

## Principles

| # | Principle | What exists | Gap | Verdict |
|---|---|---|---|---|
| 1 | Entry point is a map | `CONTRIBUTING.md` (15 lines): commit format, scope rules | No `AGENTS.md`. Nothing tells an agent which paths are managed, what the commands are (`npm test`, `npx skills add . --list`), or where rules live | gap |
| 2 | Repository is the system of record | Config, CI, release rules and validation are tracked. No untracked notes | The true source of `skills/`, `README.md` and `plugins/` is private, and that is undocumented here. `README.md:21` says the three specialists' remote install "has not been verified yet". The source catalog recorded a verified install on 2026-09-23 | partial |
| 3 | Knowledge is layered | `README.md`, `CONTRIBUTING.md`, `SECURITY.md` | No `ARCHITECTURE.md` stating the managed/owned split or that `plugins/` is generated. No `docs/`, no index | gap |
| 4 | Plans are first-class | None | No tech-debt ledger or quality grades. Four Dependabot PRs are open and untriaged: #9 (2026-09-26), #11, #12, #13. #11 is a major `actions/setup-node` bump, v4 → v7 | gap |
| 5 | Docs are checked mechanically | `scripts/validate.mjs` checks skill frontmatter and bundled LICENSE/NOTICE | Unchecked: links and image paths in `README.md`, README table rows vs `skills/`, an asset per skill, review dates | gap |
| 6 | Docs are gardened on a cadence | None | `README.md:21` is stale (see 2). No owner or cadence | gap |
| 7 | Running application is legible | CI runs `npm test` and the upstream installer's discovery (`npx skills add . --list`) with no model and no cost | Discovery output is printed, not asserted, so Finding 0 passed CI. The plugin manifests are not validated | partial |
| 8 | Each worktree runs on its own | No servers, ports, databases or shared state. `validate.mjs` only reads files | None | aligned |
| 9 | Architecture is enforced | `validate.mjs` enforces: directory name = frontmatter `name`, kebab-case, name length ≤ 64, description length ≤ 1024, `license: Apache-2.0`, bundled LICENSE/NOTICE equal the root files | No check that each plugin skill equals its source except for `name` (manual check today: no drift). No check that `marketplace.json` lists the plugin. Most asserts have no message: `assert.equal(metadata.name, name)` fails without saying what to do | partial |
| 10 | Golden principles written and checked | `CONTRIBUTING.md`: "portable, self-contained, and focused on routine work. Preserve its output contract and escalation boundaries" | Not checked. Structure varies: 6 of 12 skills have both `## Output` and `## Escalate`. `security`, `cicd-infrastructure`, `mcp-apps-specialist` and `desktop-specialist` have neither heading | partial |
| 11 | Workflow is explicit | Conventional Commits in `CONTRIBUTING.md`. semantic-release on `main`. Branch protection: required `validate`, strict, applies to admins, no force push or deletion | Squash, merge and rebase are all enabled. Releases come from the squash subject (`COMMIT_OR_PR_TITLE`), yet there is no PR-title or commit-message check. No claim protocol, reviewer prompt, or stop-and-ask rule. 0 required reviews (solo maintainer; undocumented) | partial |
| 12 | Agents are bounded | CI token `contents: read`; only `release` gets `contents: write`. Actions pinned to full SHAs. `persist-credentials: false`, `npm ci --ignore-scripts`. Secret scanning, push protection and private vulnerability reporting enabled. `.env*` ignored | No versioned agent permission settings. No hook refusing repo-wide staging. Low risk here: the repository holds no secrets | partial |

## Summary

| Verdict | Count | Principles |
|---|---|---|
| aligned | 1 | 8 |
| partial | 6 | 2, 7, 9, 10, 11, 12 |
| gap | 5 | 1, 3, 4, 5, 6 |

## Order of work

Cheapest and highest-leverage first. Items on managed paths must be changed in the private source, not here.

| # | Change | Where | Decision |
|---|---|---|---|
| 1 | Fix Finding 0 so the installer lists 12 skills while the plugin keeps working. Approach to be tested before choosing | private source (export) | **needs your decision** |
| 2 | Assert the installer's discovered count equals the number of `skills/` directories, so a duplicate fails CI | `.github/workflows/ci.yml` | **needs your decision** (adds seconds to an existing job) |
| 3 | Add `AGENTS.md` (map): managed vs owned paths, commands, link to `CONTRIBUTING.md` | here | no decision needed |
| 4 | Add `ARCHITECTURE.md`: sync boundary, generated plugin, release flow | here | no decision needed |
| 5 | Add messages to `validate.mjs` asserts that name the file and the fix | here | no decision needed |
| 6 | Extend `validate.mjs`: plugin copy equals its source except `name`; marketplace lists the plugin; one asset per skill; README row per skill | here | no decision needed |
| 7 | Correct `README.md:21` (specialist install status) | private source | no decision needed |
| 8 | Triage Dependabot #9, #11, #12, #13. #11 is a major version bump | here | **needs your decision** |
| 9 | Allow squash merge only, and add a PR-title check | repository settings + CI | **needs your decision** (changes how PRs merge; adds a CI job) |
| 10 | Add `docs/index.md`, `docs/plans/tech-debt.md`, and a docs check (links, paths, index coverage, 90-day review dates) on PRs and weekly | here | **needs your decision** (new CI schedule; changes where people look) |
| 11 | Add `reviewer.md` and `doc-gardener.md` prompts, a claim protocol, and a stop-and-ask rule in `AGENTS.md` | here | **needs your decision** (adds a `claimed` label and process) |
| 12 | Decide whether to standardize skill structure (`## Output` and `## Escalate` in every skill) and then check it | private source + `validate.mjs` | **needs your decision** (changes published profile text) |
| 13 | Add versioned agent permission settings and a hook refusing repo-wide staging | here | **needs your decision** (picks an agent host's config format) |

## Not verified

- How the installer finds `plugins/ghostcto/skills/`: a recursive scan or reading `marketplace.json`. This decides the fix for Finding 0.
- A real `/plugin install ghostcto@ghostcto-profiles` in Claude Code.
- Branch protection was read through the API. Rulesets returned none; organization-level rules were not checked.
