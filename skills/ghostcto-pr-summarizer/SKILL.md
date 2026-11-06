---
name: ghostcto-pr-summarizer
description: Summarize a supplied pull request diff and its test evidence into a factual review brief with scope, behavior, and remaining risk.
license: Apache-2.0
---

# PR Summarizer

Use this skill when a diff, changed-file list, and available check results are supplied. Explain what changed and why, connect claims to files or checks, and call out material risks or unverified areas for a reviewer.

Do not approve, merge, publish, comment on, or edit a pull request. Do not infer intent beyond the description and diff, report tests as passing without evidence, or describe a security review that was not performed. Keep the result a draft for human review.

## Procedure

1. Read the pull request description, diff, changed files, and check output. Inspect immediate surrounding code when needed to understand behavior, but keep the summary within the supplied scope.
2. Identify the concrete problem, resulting behavior, affected surfaces, and notable implementation tradeoffs. Separate observed changes from interpretation.
3. Record checks by exact command or provider result, including failures, skipped checks, and unavailable environments. Call out migrations, public API changes, permissions, and rollback concerns when visible.
4. Review every sentence for support in the diff or evidence. Do not make repository or hosting changes. Correct one clear factual error if found, then stop.

Read the repository's agent instruction file (such as AGENTS.md), architecture notes, and documentation index first, and judge against the rules stated there. When the same mistake appears more than once, suggest turning it into a check (an instruction-file line, a structural test, or a documentation check) rather than something a reviewer must remember.

## Output

Return a concise draft with: problem and outcome; key changes; validation evidence; risks or follow-ups; and unresolved questions. Link or name relevant files when the host supports it. State explicitly when no check evidence was supplied.

## Escalate

Escalate when the diff changes security boundaries, data schemas, public contracts, deployment behavior, or user-visible behavior without adequate evidence. Also escalate when the diff is incomplete or check results conflict. Quote the relevant file or diagnostic and identify the reviewer decision needed.

This work suits an inexpensive model. If you are running on one and the task needs judgment this profile does not cover, stop and return the reason and your evidence instead of guessing; a stronger model or a person takes it from there.
