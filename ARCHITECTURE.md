# Architecture

This repository has no application code. It distributes profile files and checks them. Each boundary below names the check that enforces it.

## Boundary 1: synced paths and owned paths

A one-way sync from the private GhostCTO source repository opens a pull request from the branch `sync/ghostcto-profiles` whenever profile sources change. A maintainer reviews and squash-merges it.

| Synced (source of truth is private) | Owned here |
| --- | --- |
| `README.md`, `LICENSE`, `NOTICE` | `AGENTS.md`, `ARCHITECTURE.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md` |
| `skills/**`, `assets/**` | `docs/**`, `scripts/**`, `.githooks/**`, `.claude/**` |
| `plugins/ghostcto/**`, `.claude-plugin/marketplace.json` | `.github/**`, `package.json`, `package-lock.json`, `.releaserc.json` |

The sync never deletes a file. A synced path changed here is overwritten by the next sync.

**Enforced by** `scripts/check-synced-paths.mjs` in CI. A pull request from any branch other than `sync/ghostcto-profiles` fails if it changes a synced path.

## Boundary 2: `skills/` is the source, `plugins/ghostcto/` is generated

Each `skills/ghostcto-<slug>/` is published twice:

- for `npx skills add --skill ghostcto-<slug>`, as is
- for the Claude Code plugin, as `plugins/ghostcto/skills/<slug>/`, invoked as `ghostcto:<slug>`

The plugin copy differs only in its frontmatter: `name: <slug>`, and `metadata.internal: true`. The second hides the copy from the skills CLI, which also scans plugin directories named in `.claude-plugin/marketplace.json`. Light profiles that hold up on a cheaper model also gain `context: fork`, `model: <alias>` and `background: false`, so Claude Code runs them as a forked subagent on that model; the `skills/` copy stays portable. A skill listed in `SKILL_ALIASES` in `scripts/validate.mjs` ships its plugin copy under that alias instead of its slug: `ghostcto-bigboss` becomes the plugin skill `start`, invoked as `/ghostcto:start`. The plugin may also ship generated subagents in an agents folder. `plugin.json` has no `version`, so installs follow `main`.

**Enforced by:**

- `scripts/validate.mjs`: each copy equals its source apart from those lines; no orphan copies; the marketplace lists the plugin; no version
- `scripts/check-discovery.mjs`: the skills CLI lists exactly one skill per `skills/` directory

## Boundary 3: every profile has the same contract

Each skill has frontmatter (`name` equal to its directory, a description, `license: Apache-2.0`), an `## Output` section and an `## Escalate` section. It also has bundled `LICENSE` and `NOTICE` files identical to the root ones, an avatar at `assets/<slug>.svg`, and a row in the `README.md` catalog.

**Enforced by** `scripts/validate.mjs`.

## Boundary 4: releases come from PR titles

`main` accepts squash merges only, and the squash commit subject is the PR title. semantic-release (`.releaserc.json`) reads those subjects on `main` to choose the version and write release notes: `feat` is minor, `fix` is patch, and `!` with a `BREAKING CHANGE:` footer is major.

**Enforced by:**

- `.github/workflows/pr-title.yml` and `scripts/check-commit-subject.mjs` on PR titles
- `.githooks/commit-msg` on local commits

## CI

`.github/workflows/ci.yml` has one gate, `validate`. It runs `npm test`, `npm run docs:check`, the synced-path check on PRs, and `npm run check:discovery`. It runs on PRs, on `main`, and weekly, so review dates expire even without commits. `release` runs only on pushes to `main`, after `validate`, and is the only job with write access.
