---
name: ghostcto-security
description: Review a bounded repository change or publication for credential exposure, private data, workflow trust, and missing repository protections; apply scoped hardening when authorized. Use for a pre-push security check or a named repository security issue, not a full penetration test or compliance certification.
license: MIT
---

# Security

Assess the specified change and report evidence-backed risks. Establish the repository, intended audience, files or revision to review, and whether the request is review-only or includes remediation. Reuse authorization already supplied; a request to review does not itself authorize publication or changes to production access.

## Exposure review

- Inspect the exact diff or export that will leave the machine, including tracked files, generated artifacts, symlinks, submodules, and commit metadata. For an existing repository becoming public, examine relevant history as well as the current tree. An ignored file may still be tracked or present in history; inspect the actual packaged bytes or export manifest, not just `.gitignore`.
- For a deliberately separate public component, stage only an explicit allowlist into a clean directory and inspect it before pushing. Do not copy application history, environment files, internal reports, customer data, local filesystem paths, or credentials by default. Preserve required licenses and truthful attribution. Do not rewrite an existing repository's history as a routine cleanup.
- Verify commit author and committer attribution before publication. If privacy is needed, use the actual contributor’s verified account-specific private email; never invent a generic noreply identity. Check the hosting provider’s attribution after the push. Repairing already-published metadata changes commit IDs and may affect tags and consumers, so scope and authorize that repair explicitly.
- Prefer established local secret scanners with redacted output and the repository's existing checks. Review findings without printing matching secret values, dumping environment variables, or uploading sensitive files to an external scanner. Report locations and secret types, not secret contents. Pattern searches supplement scanners; they are not proof of safety.
- If a credible live credential is found, stop the affected publication and report it privately with redacted evidence. Recommend revocation or rotation by the authorized owner and assess prior exposure. Removing a file alone does not invalidate a leaked credential. Do not rotate unrelated credentials, delete evidence, or rewrite remote history without authorization.

## Repository and workflow controls

Inspect the effective settings rather than assuming a configuration file was applied: secret scanning and push protection where available, private vulnerability reporting, dependency alerts, protected branches or rulesets, required CI, and restrictions on force pushes/deletion. Match human approval requirements to actual available maintainers; never fabricate reviewers or weaken protections just to unblock a push. Separate “enabled,” “unsupported,” and “not checked.”

For workflow review, trace trust boundaries: external PR input, executable code, artifacts, caches, and access to secrets or write tokens. Flag untrusted code running in privileged contexts, unnecessarily broad permissions, unsafe shell interpolation, and unverified third-party dependencies. Pin external Actions to verified full revisions and keep updates reviewable. Confirm that release jobs receive only the permissions they need.

## Verification and reporting

After an authorized correction, rerun the relevant check and read back remote settings. Verify the exact destination, staged revision, and exposure scope before an authorized push. After a timeout, inspect remote branch/tag IDs, release records, workflow conclusions, and published artifacts before retrying a mutation. Identify partial completion and retry only the missing safe step. Never bypass a secret-scanning block merely to finish.

Return scope, findings by impact with locations and evidence, changes made, checks performed, residual risks, and unavailable coverage. Say “no findings in these checks,” not “secure” or “no secrets exist.” A skill does not enforce a sandbox or grant permissions.

Use deterministic inventory and scanning for routine work. Escalate credible compromise, uncertain exploitability, sensitive access changes, or architecture-level trust decisions to the appropriate maintainer or stronger review path. Model selection remains with the host; do not spawn reviewers or buy services automatically.

For GitHub-specific details, consult current official documentation when needed:
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning
