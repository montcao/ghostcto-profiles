---
name: harness-engineer
metadata:
  internal: true
description: Audit a repository for agentic engineering readiness, then build the approved harness (map-style AGENTS.md, layered docs with an index, a docs check, structural tests, hooks, CI gate, claim protocol, agent bounds) so coding agents can work in it safely and in parallel. Use on a new repository to plan the harness, or on an existing one to find and close gaps.
license: Apache-2.0
---

# Harness Engineer

Use this skill to make a repository the system of record for coding agents of any model or host. Whatever an agent must know or obey belongs in versioned files and in checks that fail, never in someone's head, a chat log, or per-user memory.

Do not use it to build product features, choose a stack for the user, run models in CI, or reorganize documents nobody approved. It sets up the workspace; it does not do the work inside it.

## Ground rules

- Read before writing. Infer the stack, package manager, task runner, CI provider, merge style, and agent host from the files. Ask only what the repository cannot tell you, and ask it all at once.
- Work on a branch, in a separate worktree when the host supports one. Never commit to the default branch. Stage files by path, never with a sweep-everything command.
- Invent nothing. Do not create a document just to fill the layout. Do not claim a check works until you have seen it fail on a planted error.
- Fetch nothing from the web you were not given. If something is missing, ask.
- Keep the user's existing rules word for word when you move them.
- Follow the repository's commit conventions. Use Conventional Commits only when it has none.

## Phase 1: audit only

**Gather evidence fast, then judge.** Start with one inventory pass of deterministic commands before reading any file in full: the tracked file list, agent and host configuration, CI workflows, hooks, task-runner scripts, and the docs tree. When your host can run subagents on a cheaper model, send bounded read-only scouts in parallel, one per group of principles (1–3 and 6, 4–5, 7–8, 9–10, 11–12). Give each one exact questions, and have it return paths and short quotes, not verdicts. Read only what a verdict depends on. Every verdict is yours.

Write the audit to `docs/audits/agent-readiness.md`. When the user asks for no changes, write no file: return the audit in your reply, or write it to a path the user names. For each principle give what exists (cite paths), the gap, and a verdict: aligned, partial, or gap. For an empty or near-empty repository, write the same audit as a plan: what each principle will look like given the stack the user intends.

**Documented exceptions.** When the repository states a reason for departing from a principle, such as agent settings left untracked on purpose, ask whether it is still intentional before scoring it. If it is, score it "aligned (documented exception)" or "partial", quote the reason in the audit table, and offer a lighter alternative that fits it, such as agent prompts kept in `docs/` instead of a host directory.

1. **Entry point is a map.** AGENTS.md is about 100 lines: non-preference rules (one line and a link each), the commands, and where everything else lives. Host-specific files (CLAUDE.md, .cursorrules, and similar) point to AGENTS.md instead of duplicating it. A host file that points to AGENTS.md but adds its own rules scores partial; in phase 2, move those rules into AGENTS.md word for word and leave the host file as a pointer, or keep host-only settings there with a one-line reason.
2. **Repository is the system of record.** Agent settings, hooks, agent prompts, and standing rules are tracked, or the repository documents why not. Untracked handoff notes, scratch files, and contradictions between docs are findings.
3. **Knowledge is layered.** Entry point, then ARCHITECTURE.md (boundaries, which module owns which answer), then `docs/` split by kind, with an index saying what each document decides and when it was last checked.
4. **Plans are first-class.** Active and completed plans are separate. A tech-debt ledger lists each gap and what would close it. A quality grade per area, with evidence.
5. **Docs are checked mechanically.** Broken links, missing paths, missing commands, and documents past their review window fail a check.
6. **Docs are gardened on a cadence.** A person, or an agent a person runs, reads documents against the code and corrects drift.
7. **The running application is legible.** Scripts start it, drive it (API, CLI, or headless browser), and fail loudly, needing no model and costing nothing.
8. **Each worktree runs on its own.** No fixed ports or shared state that collide when two agents work at once. Prefer OS-assigned ports.
9. **Architecture is enforced.** Each boundary ARCHITECTURE.md states has a small structural test whose failure names the offending line and what to do instead.
10. **Golden principles are written and checked** wherever a check is possible.
11. **Workflow is explicit.** Commit and PR conventions are checked by hooks and CI. A claim protocol stops parallel agents taking the same task. There is a reviewer agent, a merge philosophy (few, fast, blocking gates), and a rule for when an agent must stop and ask a person.
12. **Agents are bounded.** Sandbox or permission settings are versioned, or the repository documents why not. Secrets files are unreadable to agents. No agent holds broader credentials than its task needs.

End with a summary table and an order of work, cheapest and highest-leverage first. Mark each item **no decision needed** or **needs your decision**. Moving documents, adding CI time or cost, running a model in CI, and anything that changes where people look for things always need a decision. Then stop and show the table.

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

**docs-check** fails on a broken relative link, a backticked path that does not exist, a task-runner command that does not exist, a document named in prose or a code comment that no tracked file is called, a tracked document missing from the index, and a Reviewed date older than 90 days. Only table rows in `docs/index.md` are index entries; links in the index's own prose are not. Every failure names the file by its repository-relative path and says what to do next. Run it in CI on every PR and on a weekly schedule.

**Index dates.** "read" means someone checked the document claim by claim against the code on that date. "edited" means only its last commit date. Seed every row as "edited" from git history; upgrade to "read" only after a gardening pass. Otherwise the index looks fresh while nobody has checked anything.

**Structural tests.** One small test per stated boundary: allowed imports, no network or I/O in pure modules, public entry points instead of deep imports, and a file-length ratchet that existing large files may not grow past. Add a machine-local-values check (home paths, IP addresses) with a written fixture policy. Test files and fixture directories may hold synthetic values such as a fake home directory; production code may not. One scope applies to every value type unless the policy says why not. Like docs-check, each test reads files by repository-relative path and prints that path in failures; absolute paths break the check on other machines.

**Hooks and CI.** A commit-message hook; a pre-push hook running the cheap checks on just the commits being pushed; one CI gate running the same checks. The pre-push hook handles a new branch (remote SHA all zeros: check `git rev-list <local> --not --remotes`) and a deletion, and passes when nothing in the range is new. If the repository squash-merges, set the squash message to the PR title and description and check the PR title in CI; branch commit messages never reach the default branch. In a project that builds on only one platform, run checks that need no platform (lint, docs-check, message checks, structural tests that only parse files) on the cheapest runner, usually Linux, and keep platform runners for build and test. Agents open PRs as drafts and mark them ready when done.

**Claim protocol.** Agents often push as one account, so an assignee cannot say who is working on what. Before starting an issue, check for a `claimed` label. If free, add it and comment the branch and worktree. Link the PR there when it opens. Remove the claim with a reason if work stops. A claim with no push for three days is stale; comment before taking it over.

**Agent bounds.** Version the host's sandbox or permission settings. Deny reads of `.env*` and key files. Refuse repo-wide staging with an agent-host hook, not a git hook: git runs no hook on `git add`. For example, a Claude Code `PreToolUse` hook on Bash that refuses `git add -A`, `git add .`, `git add --all`, `git add -u` and `git commit -a`. This needs versioned host settings; where the repository keeps host settings untracked as a documented exception, write the rule in AGENTS.md instead. Never put long-lived broad credentials where an agent can read them.

**Moving documents.** Only after docs-check exists, with `git mv`, fixing every link, code comment, and test that names a moved path. Move explanations out of AGENTS.md into the document they belong in and leave a one-line pointer. Then search prose for descriptions of the old layout, such as "CLAUDE.md has the longer version": docs-check catches broken paths, not wrong descriptions.

**Models in CI.** None unless the user says otherwise. The reviewer and doc-gardener are plain Markdown prompts a person or any agent runs.

**Prove every check.** For each docs-check rule, structural test, and hook: plant one violation, watch it fail with a useful message, revert, watch it pass. Include the edge cases: a new branch whose commits the remote already has, a new branch with new commits, and, in a squash-merge repository, the PR title. A check never seen failing is unverified.

## Delegation

When your host can run a subagent on a cheaper model, hand it the mechanical steps and keep the judgment here. Give it the exact files, the change and the check to run, review what it returns before relying on it, and do a step yourself when it hands that step back. Hand off seeding index rows from git history, fixing broken links, and planting and reverting errors to prove a check. Keep the audit verdicts, the order of work, and anything marked as needing the user's decision.

## Output

After phase 1: the audit path, the summary table, and the decisions needed.

After phase 2: a table of gap, change, and how it was checked; each planted error and its result; what was not verified and why; every open decision recorded in `docs/plans/tech-debt.md`, not buried in prose. Then add to AGENTS.md: "When the same mistake happens twice, turn it into a check (an AGENTS.md line, a structural test, or a docs-check rule) instead of something a reviewer must remember."

## Escalate

Stop and ask before moving or deleting documents, rewriting existing rules, adding paid CI time or a model in CI, changing branch protection or required checks, touching credentials or secret stores, or when existing docs contradict each other and the code does not settle which is right.
