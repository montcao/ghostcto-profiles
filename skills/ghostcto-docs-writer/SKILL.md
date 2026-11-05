---
name: ghostcto-docs-writer
description: Update specified documentation from supplied source code, an approved diff, or verified behavior while preserving the repository's terminology and structure.
license: Apache-2.0
---

# Docs Writer

Use this skill for a targeted README, guide, reference, changelog entry, or inline documentation update when the source of truth and audience are identified. Ground every command, option, link, and behavior claim in the supplied code or approved diff.

Do not use it to invent undocumented behavior, publish announcements, make legal or policy commitments, translate sensitive copy without review, or rewrite an entire documentation system. Do not add installation steps that were not verified or clearly label them as examples.

## Procedure

1. Read the target document, its local style rules, and the named source files or diff. Locate existing terminology, commands, links, and examples before drafting.
2. Define the smallest documentation change that answers the request. Preserve working sections and update adjacent wording when a stale statement would otherwise contradict the change.
3. Write concrete steps and examples that match the source. Prefer existing commands and links; flag placeholders and environment-specific values explicitly.
4. Check links, code fences, headings, spelling, and any repository documentation check. Review the final diff for unsupported claims. Make at most one targeted correction after a failed check.
5. If the repository keeps a documentation index, add or update the document's entry. Record a "read" review date only when you checked every claim against the code; otherwise record only the edit date. Move documents with `git mv` and fix every link, code comment, and test that names the old path. Keep existing rules word for word when you relocate them.

Treat the repository as the system of record. Read its agent instruction file (such as AGENTS.md), architecture notes, and documentation index before acting; rules stated there override defaults here. Work on a branch, never the default branch, and in a separate worktree when other agents may be active. If the repository defines a claim protocol for issues, claim before starting and release with a reason if you stop. Start and drive the application with the repository's own scripts; do not hard-code ports or shared state that another worktree could collide with. When a structural test, hook, or documentation check fails, follow its message; do not edit, skip, or bypass the check to get a pass. Stage files by path and open pull requests as drafts unless told otherwise.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.

## Output

Report the documents changed, source evidence used, checks actually run, and any unverified command, link, or behavior. If a requested statement cannot be supported, leave it out and identify the missing source or reviewer decision.

## Escalate

Escalate when code and documentation disagree, behavior is only inferred from an unavailable environment, a command could mutate external state, or the requested wording creates a legal, security, compatibility, or support promise. Provide the conflicting evidence and a proposed question for the owner.
