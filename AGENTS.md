# AGENTS.md

Map for coding agents and people working in this repository. Rules are one line each; follow the link for detail.

## What this repository is

The public distribution of GhostCTO profiles: portable Agent Skills, installable with `npx skills` or as the `ghostcto` Claude Code plugin. See [README.md](README.md).

## Rules

- **Synced paths are read-only here.** `README.md`, `LICENSE`, `NOTICE`, `skills/`, `assets/`, `plugins/ghostcto/` and `.claude-plugin/marketplace.json` are overwritten by the profile sync from the private source repository. Change them there. See [ARCHITECTURE.md](ARCHITECTURE.md).
- **Never edit `plugins/ghostcto/` by hand.** It is generated from `skills/`.
- **Commits and PR titles use Conventional Commits.** PRs are squash-merged and the PR title becomes the release commit. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Credit no AI model or tool** in commits, PR titles, descriptions or issues: no model `Co-Authored-By` trailer, no `Generated with` line. Real-account co-authors such as `dependabot[bot]` are fine. `scripts/check-attribution.mjs` enforces it on every PR.
- **Work on a branch, never `main`.** Stage files by path; repo-wide staging is refused by the agent hook.
- **Open PRs as drafts** and mark them ready when checks pass and the description lists the checks you ran.
- **Do not bypass a failing check.** Its message says what to do. Never use `--no-verify`.
- **Do not read secrets files** (`.env*`, keys). None belong in this repository.
- **Claim before you start** (below).
- **Stop and ask a person** (below).
- **When the same mistake happens twice, turn it into a check** (a line here, a test in `scripts/validate.mjs`, or a `scripts/docs-check.mjs` rule) instead of something a reviewer must remember.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci --ignore-scripts` | Install exact dev dependencies |
| `npm test` | Validate skills, plugin copies, assets and catalog rows |
| `npm run docs:check` | Check docs: links, paths, commands, index coverage, review dates |
| `npm run check:discovery` | Run the upstream skills CLI and require one listed skill per `skills/` directory (needs network) |
| `npm run check` | `npm test` and `npm run docs:check` (what the pre-push hook runs) |
| `npm run hooks` | Use the versioned git hooks in `.githooks/` for this clone |

CI runs all of the above in the `validate` job on every PR, on `main`, and weekly. Nothing here starts a server or uses a port.

## Claim protocol

Several agents may push as one account, so assignees do not show who is working on what.

1. Before starting an issue, check for the `claimed` label. If present, pick something else.
2. If free, add `claimed` and comment the branch name and worktree.
3. When the PR opens, link it in that comment.
4. If you stop, remove the label and comment why.
5. A claim with no push for three days is stale. Comment on the issue before taking it over.

## Stop and ask a person

Before you: change a synced path; change CI, branch protection, required checks, release configuration or repository settings; merge anything; add a dependency; touch credentials; or resolve a contradiction between docs that the code does not settle.

## Where things live

| Path | Holds |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Sync boundary, generated plugin, release flow, what each check enforces |
| [docs/index.md](docs/index.md) | Every document, what it decides, and when it was last reviewed |
| [docs/plans/tech-debt.md](docs/plans/tech-debt.md) | Known gaps and what would close each |
| `.claude/agents/` | `reviewer.md` (reviews a branch, edits nothing) and `doc-gardener.md` (fixes doc drift) |
| `.claude/settings.json` | Versioned agent permissions and hooks |
| `scripts/` | `validate.mjs`, `docs-check.mjs`, `check-discovery.mjs`, `check-commit-subject.mjs` |
