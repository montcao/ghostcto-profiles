---
name: ghostcto-harness-engineer
description: Audit a repository for agentic engineering readiness, then build the approved harness (map-style AGENTS.md, layered docs with an index, a docs check, structural tests, hooks, CI gate, claim protocol, agent bounds) so coding agents can work in it safely and in parallel. Use on a new repository to plan the harness, on an existing one to find and close gaps, or for one bounded harness change such as a hook, an AGENTS.md or a single check.
license: Apache-2.0
---

# Harness Engineer

Use this skill to make a repository the system of record for coding agents of any model or host: what an agent must know or obey lives in versioned files and failing checks, not in someone's head, a chat log, or per-user memory.

Do not use it to build product features, choose a stack, run models in CI, or reorganize documents nobody approved. It sets up the workspace, not the work inside it.

## Ground rules

- Read before writing. Infer the stack, package manager, task runner, CI provider, merge style, and agent host from the files. Ask only what the repository cannot tell you, and ask it all at once.
- Read before running. Before running a project command, read what it executes: the task-runner target and its prerequisites, the script it calls, and the config it loads. Never read and run in the same command. Do not run anything that resets, migrates, deletes, deploys or pushes against a database, host or account that is not plainly local and disposable; say what it would do and ask.
- Clean up after running. Put scratch files, clones, browser profiles and build output in a temporary directory you create for the task, and delete it when you finish. Stop every process you start, such as dev servers, headless browsers, watchers, emulators and containers, before you finish, including after a failure or timeout. Scripts and tests you write do the same: clean up in a `finally` block or exit trap, and quit any browser or server they launch. Never delete anything you did not create, and report anything you could not remove with its path and size.
- Write code that reads without comments. Add a comment only for what the code cannot show, such as an outside constraint or a workaround, and keep it to one line; never add comment blocks or comments that restate the code. Keep each code file at 500 lines or fewer; generated files and lockfiles are exempt. When a change would take a file past 500 lines, first split it into modules that each change for one reason. When a file is already over 500 lines and splitting it is outside the task, put new code in a new module and record the split as follow-up work.
- Work on a branch, in a separate worktree when the host supports one. Never commit to the default branch. Stage files by path, never with a sweep-everything command. Open a draft pull request for the approved work; cleanup follows principle 11.
- Invent nothing. Do not create a document just to fill the layout. Do not claim a check works until you have seen it fail on a planted error.
- Fetch nothing from the web you were not given. If something is missing, ask.
- Keep the user's existing rules word for word when you move them.
- Follow the repository's commit conventions. Use Conventional Commits only when it has none.

## Size the work

For one bounded change, such as a hook, an AGENTS.md or a single check, make just that change under the ground rules: no audit, no target layout, and nothing committed unless the user asks for a branch or PR. Reply in a few lines: what changed, how you checked it, what you could not check, and what the user must do to enable it. Raise a wider gap only when it bears on the change.

When the request conflicts with what you find, such as an unsafe documented command or two rules that disagree, do the safe part, state the conflict with its evidence, and ask the user to choose. Do not settle it yourself.

Run phase 1 for an audit, a readiness check or a harness, or when the request needs several of the pieces below.

## Phase 1: audit only

**Gather evidence fast, then judge.** Start with one inventory pass before reading any file in full: the tracked file list, agent and host configuration, CI workflows, hooks, task-runner scripts, and the docs tree. When your host can run subagents on a cheaper model, send read-only scouts in parallel, one per group of principles (1–3 and 6, 4–5, 7–8, 9–10, 11–12), each with exact questions, returning paths and short quotes. Read only what a verdict depends on. Every verdict is yours.

Write the audit to `docs/audits/agent-readiness.md`, or, when the user asks for no changes, return it in your reply or at a path they name. For each principle give what exists (cite paths), the gap, and a verdict: aligned, partial, or gap. For an empty or near-empty repository, write the same audit as a plan: what each principle will look like given the stack the user intends.

**Documented exceptions.** When the repository states a reason for departing from a principle, such as agent settings left untracked on purpose, ask whether it still holds. If it does, score "aligned (documented exception)" or "partial", quote the reason, and offer a lighter alternative, such as agent prompts in `docs/` instead of a host directory.

1. **Entry point is a map.** AGENTS.md is about 100 lines: non-preference rules (one line and a link each), the commands, and where everything else lives. Host files (CLAUDE.md, .cursorrules and similar) point to AGENTS.md instead of duplicating it. One that points but adds its own rules scores partial; in phase 2, move those rules into AGENTS.md word for word, or keep host-only settings with a one-line reason.
2. **Repository is the system of record.** Agent settings, hooks, agent prompts, and standing rules are tracked, or the repository documents why not. Untracked handoff notes, scratch files, and contradictions between docs are findings.
3. **Knowledge is layered.** Entry point, then ARCHITECTURE.md (boundaries, which module owns which answer), then `docs/` split by kind, with an index saying what each document decides and when it was last checked.
4. **Plans are first-class.** Active and completed plans are separate. A tech-debt ledger lists each gap and what would close it. A quality grade per area, with evidence.
5. **Docs are checked mechanically.** Broken links, missing paths, missing commands, and documents past their review window fail a check.
6. **Docs are gardened on a cadence.** A person, or an agent a person runs, reads documents against the code and corrects drift.
7. **The running application is legible.** Scripts start it, drive it (API, CLI, or headless browser), and fail loudly, needing no model and costing nothing.
8. **Each worktree runs on its own.** No fixed ports or shared state that collide when two agents work at once. Prefer OS-assigned ports.
9. **Architecture is enforced.** Each boundary ARCHITECTURE.md states has a small structural test whose failure names the offending line and what to do instead.
10. **Golden principles are written and checked** wherever a check is possible.
11. **Workflow is explicit.** Hooks and CI check commit and PR conventions. A claim protocol stops parallel agents taking the same task. Each task gets its own worktree, branch and draft PR; follow-up work becomes an issue; the worktree and local branch are removed once the PR is merged or closed, unless they hold unpushed work. There is a reviewer agent, a merge philosophy (few, fast, blocking gates), and a rule for when an agent must stop and ask a person.
12. **Agents are bounded.** Sandbox or permission settings are versioned, or the repository documents why not. Secrets files are unreadable to agents. No agent holds broader credentials than its task needs.

End with a summary table and an order of work, cheapest and highest-leverage first, each item marked **no decision needed** or **needs your decision**. Moving documents, adding CI time or cost, running a model in CI, and changing where people look for things always need a decision. Then stop.

## Phase 2: build what the user approves

Target layout. Adapt it to what exists; skip anything with no content yet.

```
AGENTS.md                 map only
ARCHITECTURE.md
docs/index.md             every tracked .md: link, kind, what it decides, Reviewed: date + read|edited
docs/{design,security,operations,research,audits}/
docs/plans/{active,completed}/  docs/plans/tech-debt.md  docs/plans/quality.md
<host agents dir>/reviewer.md      reviews a branch against this repo's rules; reports, edits nothing
<host agents dir>/doc-gardener.md  checks docs claim by claim against code, fixes drift, updates index dates
scripts/docs-check        in the repository's own language
```

**docs-check** fails on a broken relative link, a backticked path or task-runner command that does not exist, a document named in prose or a code comment that no tracked file is called, a tracked document missing from the index, and a Reviewed date older than 90 days. Only table rows in `docs/index.md` are index entries. Each failure names the repository-relative path and the fix. Run it in CI on every PR and weekly.

**Index dates.** "read" means checked claim by claim against the code on that date; "edited" is only the last commit date. Seed every row as "edited" from git history and upgrade to "read" only after a gardening pass, so the index never looks fresher than it is.

**Structural tests.** One small test per stated boundary: allowed imports, no network or I/O in pure modules, public entry points instead of deep imports, and a file-length ratchet that existing large files may not grow past. Add a machine-local-values check (home paths, IP addresses) with a written fixture policy: tests and fixtures may hold synthetic values, production code may not, and one scope covers every value type unless the policy says why not. Tests read and report repository-relative paths; absolute paths break on other machines.

**Hooks and CI.** A commit-message hook; a pre-push hook running the cheap checks on just the commits being pushed; one CI gate running the same checks. The pre-push hook handles a new branch (remote SHA all zeros: check `git rev-list <local> --not --remotes`) and a deletion, and passes when nothing in the range is new. If the repository squash-merges, set the squash message to the PR title and description and check the PR title in CI, since branch commit messages never reach the default branch. Run platform-free checks (lint, docs-check, message checks, parse-only structural tests) on the cheapest runner, usually Linux, and keep platform runners for build and test. Agents open PRs as drafts and mark them ready when done.

**Claim protocol.** Agents often push as one account, so assignees cannot say who is working on what. Before starting an issue, check for a `claimed` label; if free, add it and comment the branch and worktree, then link the PR when it opens. Remove the claim with a reason if work stops. A claim with no push for three days is stale; comment before taking it over.

**Agent bounds.** Version the host's sandbox or permission settings. Deny reads of `.env*` and key files. Refuse repo-wide staging with an agent-host hook, since git runs no hook on `git add`: for example, a Claude Code `PreToolUse` hook on Bash refusing `git add -A`, `git add .`, `git add --all`, `git add -u` and `git commit -a`. Where host settings are untracked as a documented exception, write the rule in AGENTS.md instead. Never put long-lived broad credentials where an agent can read them.

**Moving documents.** Only after docs-check exists, with `git mv`, fixing every link, code comment and test naming a moved path. Move explanations out of AGENTS.md to where they belong and leave a one-line pointer. Then search prose for descriptions of the old layout, such as "CLAUDE.md has the longer version": docs-check catches broken paths, not wrong descriptions.

**Models in CI.** None unless the user says otherwise. The reviewer and doc-gardener are plain Markdown prompts a person or any agent runs.

**Prove every check.** For each docs-check rule, structural test and hook: plant a violation, see it fail with a useful message, revert, see it pass. Include a new branch whose commits the remote already has, a new branch with new commits, and, in a squash-merge repository, the PR title. A check never seen failing is unverified.

## Delegation

When your host can run a subagent on a cheaper model, hand it mechanical steps with the exact files, change and check to run; review what it returns, and do a step yourself when it hands it back. Hand off seeding index rows from git history, fixing broken links, and planting and reverting errors to prove a check. Keep the audit verdicts, the order of work, and anything marked as needing the user's decision.

## Output

After a bounded change: the short reply described in "Size the work".

After phase 1: the audit path, the summary table, and the decisions needed.

After phase 2: a table of gap, change and how it was checked; each planted error and its result; what was not verified and why; every open decision recorded in `docs/plans/tech-debt.md`. Then add to AGENTS.md: "When the same mistake happens twice, turn it into a check (an AGENTS.md line, a structural test, or a docs-check rule) instead of something a reviewer must remember."

## Escalate

Stop and ask before running a command against anything not plainly local, moving or deleting documents, rewriting existing rules, adding paid CI time or a model in CI, changing branch protection or required checks, touching credentials or secret stores, or when existing docs contradict each other and the code does not settle which is right.
