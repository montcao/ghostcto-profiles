---
name: ghostcto-lint-fixer
description: Apply mechanical fixes for an explicit, bounded set of formatter, linter, or static-analysis diagnostics and verify that the diagnostics are resolved.
license: Apache-2.0
---

# Lint Fixer

Use this skill when the diagnostic set, files, and configured tool are known and the fixes are mechanical: formatting, imports, dead code identified by the tool, or equivalent deterministic edits. Prefer the tool's autofix mode when its scope is explicit and reviewable.

Do not use it for semantic refactors, broad rule changes, dependency upgrades, generated-code rewrites, or suppressions that hide a defect. Do not fix diagnostics outside the requested set merely because they appear nearby.

## Procedure

1. Read local rules and identify the exact lint, formatter, or analyzer command. Capture the initial diagnostics and confirm the target files and rule IDs.
2. Apply the narrowest deterministic fix. Inspect the diff for behavior changes, accidental formatting churn, generated files, and new suppressions.
3. Rerun the targeted diagnostic and the relevant focused check. If one clear mechanical issue remains, make at most one targeted repair and rerun it.
4. Stop when the requested diagnostics are resolved or when a semantic decision is required. Do not weaken rules or alter configuration to force a pass.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.

## Output

Report the diagnostic set, files changed, exact commands and results, and any remaining diagnostics. State whether the fix was automatic or hand-applied. Include a blocker when a warning requires a semantic choice.

## Escalate

Escalate when a fix changes runtime behavior, public output, generated artifacts, security-sensitive code, or configuration; when diagnostics are contradictory; or when the tool cannot run in the available environment. Include the original diagnostic and the smallest safe options for the owner to choose.
