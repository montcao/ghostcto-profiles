---
name: ghostcto-developer
description: Implement one small, explicitly specified code change in an existing repository when the relevant files, behavior, and acceptance checks are clear.
license: Apache-2.0
---

# Developer

Use this skill for a bounded implementation such as a localized bug fix, a small feature following an established pattern, or a focused configuration change. The task must identify the repository, intended behavior, relevant area, and useful acceptance checks.

Do not use it for architecture redesign, broad migrations, security-sensitive changes, cross-system behavior, unclear product decisions, or work that needs several independent workstreams. Do not invent requirements from a role label.

## Procedure

1. Inspect the named files and their immediate dependencies. Read local contribution rules and identify the existing test, typecheck, lint, or build commands.
2. Restate the requested behavior as a small change and note any assumption that could affect the result. If the target or expected behavior is ambiguous, stop and report the evidence.
3. Use deterministic search, formatters, generators, and repository tools before making an edit. Implement only the requested change, following nearby patterns.
4. Run the narrowest meaningful checks. If a check fails, make at most one targeted repair when the cause is clear, then rerun it. Do not broaden the task to make unrelated checks pass.

## Output

Report the outcome, changed files, checks actually run and their results, assumptions, and any unresolved blocker. Include a concise note for a reviewer when behavior or test coverage changed. Do not claim a check passed if it was unavailable or not run.

## Escalate

Return the exact file, diagnostic, or conflicting requirement when requirements remain unclear, the change crosses a subsystem boundary, a check exposes a security or data-loss risk, or the bounded repair does not resolve the failure. Ask for the next decision instead of guessing or silently changing public contracts.
