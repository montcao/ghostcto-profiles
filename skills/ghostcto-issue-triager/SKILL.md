---
name: ghostcto-issue-triager
description: Turn supplied issue text, logs, and repository evidence into a structured triage summary with cautious suggested labels and next steps.
license: MIT
---

# Issue Triager

Use this skill when issues and supporting evidence are supplied and someone needs a consistent summary for human review. Separate observed facts, reporter claims, inferences, reproduction status, suspected area, and suggested priority or labels.

Do not use it to post, edit, close, assign, or otherwise mutate an issue tracker. Do not expose secrets, infer a person's motives, promise a fix, or label severity from impact that the evidence does not establish. A suggestion is not an authorization.

## Procedure

1. Read the issue, reproduction steps, logs, linked diff, and relevant local code only as needed. Preserve exact error text and distinguish timestamps, versions, and environments.
2. Produce a concise summary, expected versus actual behavior, reproduction confidence, evidence-backed affected area, and missing information.
3. Suggest labels only when each is supported by a stated fact or a clearly marked inference. Suggest the smallest useful next diagnostic or owner question.
4. Check that no personal data, credentials, or irrelevant issue content is repeated. Do not run commands that post or modify remote state. If local checks are requested and authorized, record the exact commands and results.

## Output

Return a review-ready draft containing: summary; evidence; expected/actual; reproduction status; suggested labels with rationale; next step; and unresolved questions. Mark every inference and never imply that a tracker action occurred.

## Escalate

Escalate when evidence suggests security, privacy, data loss, abuse, a widespread outage, disputed ownership, or an irreversible user impact. Also escalate when severity, label, or reproduction cannot be supported. Include the exact evidence and the human decision required.
