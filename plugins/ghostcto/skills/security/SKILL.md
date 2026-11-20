---
name: security
metadata:
  internal: true
description: Review a repository change or publication for credential exposure, private data, workflow trust, and missing repository protections, and run a codebase security audit for application vulnerabilities when one is asked for or needed; apply scoped hardening when authorized. Use for a pre-push security check, a named security issue, or a security audit of a codebase; not for compliance certification or testing deployed systems.
license: Apache-2.0
---

# Security

Assess the specified change and report evidence-backed risks. Establish the repository, intended audience, files or revision to review, and whether the request is review-only or includes remediation. Reuse authorization already supplied; a request to review does not itself authorize publication or changes to production access.

**Choose the depth.** Run the exposure review below by default. Run a codebase audit as well when the request asks for one (a security audit, a penetration-test-style review, a comprehensive or end-to-end review, or a findings report), or when the exposure review reaches a trust boundary it cannot judge without tracing code paths through the application. When a request is ambiguous, ask once. State which depth you chose and why.

## Exposure review

- Inspect the exact diff or export that will leave the machine, including tracked files, generated artifacts, symlinks, submodules, and commit metadata. Before any push or share, read every commit that will be sent (for example `git log -p` over the range the destination lacks), not only the final diff: a file added in one commit and deleted in a later one is still published. For an existing repository becoming public, examine its whole history as well as the current tree. An ignored file may still be tracked or present in history; inspect the actual packaged bytes or export manifest, not just `.gitignore`.
- For a deliberately separate public component, stage only an explicit allowlist into a clean directory and inspect it before pushing. Do not copy application history, environment files, internal reports, customer data, local filesystem paths, or credentials by default. Preserve required licenses and truthful attribution. Do not rewrite an existing repository's history as a routine cleanup.
- Verify commit author and committer attribution before publication. If privacy is needed, use the actual contributor’s verified account-specific private email; never invent a generic noreply identity. Check the hosting provider’s attribution after the push. Repairing already-published metadata changes commit IDs and may affect tags and consumers, so scope and authorize that repair explicitly.
- Prefer established local secret scanners with redacted output and the repository's existing checks. Review findings without printing matching secret values, dumping environment variables, or uploading sensitive files to an external scanner. Report locations and secret types, not secret contents. Pattern searches supplement scanners; they are not proof of safety.
- Never write a credential's literal value into a command, file, test, fixture, commit message or reply, including a value the user pasted and including while reproducing a bug: commands land in shell history and logs. Use a synthetic value of the same shape, refer to the real one by type and location, and confirm removal with a scanner or a search for a short prefix.
- Do not copy real personal or customer records into tests, fixtures, examples, commit messages or replies, even a single name, identifier or note. Write synthetic records with the same shape and edge cases.
- If a credible live credential is found, stop the affected publication and report it privately with redacted evidence. Recommend revocation or rotation by the authorized owner and assess prior exposure. Removing a file alone does not invalidate a leaked credential. Do not rotate unrelated credentials, delete evidence, or rewrite remote history without authorization.

## Repository and workflow controls

Inspect the effective settings rather than assuming a configuration file was applied: secret scanning and push protection where available, private vulnerability reporting, dependency alerts, protected branches or rulesets, required CI, and restrictions on force pushes/deletion. Match human approval requirements to actual available maintainers; never fabricate reviewers or weaken protections just to unblock a push. Separate “enabled,” “unsupported,” and “not checked.”

For workflow review, trace trust boundaries: external PR input, executable code, artifacts, caches, and access to secrets or write tokens. Flag untrusted code running in privileged contexts, unnecessarily broad permissions, unsafe shell interpolation, and unverified third-party dependencies. Pin external Actions to verified full revisions and keep updates reviewable. Confirm that release jobs receive only the permissions they need.

For coding agents, check that sandbox or permission settings are versioned in the repository, that secrets files such as `.env*` and private keys are unreadable to agents, that repo-wide staging is refused, and that no agent can read long-lived credentials broader than its task needs. Report gaps; changing them needs the same authorization as any access change.

## Irreversible and published changes

Some actions cannot be undone by a later commit. Before taking one, read the repository's release, retention and change-control documents. When they apply, or you cannot tell, stop and ask: prepare what you can locally, name what the action would destroy or expose and the approval it needs, and propose a safe alternative.

- **Published refs.** Treat pushed release tags, published packages and pushed shared history as immutable. Do not move, delete or force-push them, even when asked or told force is fine; propose a new version or a revert instead.
- **The only copy.** Before deleting or overwriting a file that is untracked, ignored or otherwise the only copy (keys, evidence, exports, backups), check whether anything still depends on it. Retiring or rotating a key does not make it safe to delete while data encrypted with it still exists.
- **Weakening a control.** A change that relaxes review requirements, branch protection, code ownership, runner trust or access to secrets is an access change. Follow the documented approval path, and until approval is given, do not commit it to a protected branch or push it anywhere it could take effect.

## Codebase audit

1. **Map before hunting.** Identify entry points, the principals who can reach each one (anonymous users, tenants, other services, local processes, CI), trust boundaries, sensitive resources and actions, and the controls that guard them. Turn that map into a coverage list of units, such as routes, handlers, jobs, parsers, IPC channels and workflows, and track which units have been reviewed.
2. **Fan out only when it pays.** When the host can run subagents and the user has not asked you to stay single-agent, split mapping across read-only scouts by area, then hunt in independent passes by area or vulnerability class. Keep the number of subagents proportional to the codebase, and say how many you plan to run before a large run. Otherwise, work through the coverage list yourself.
3. **Gate every candidate.** A finding qualifies only when you can name the lower-trust principal, the input or action they control, the control meant to stop it, the boundary it crosses, the principal or resource affected, and the concrete result, traced through the source. A missing best practice is a hardening note, not a vulnerability. Never inflate a crash or an error into a worse outcome than the evidence shows.
4. **Try to disprove it.** Before reporting a candidate, re-check it adversarially, with a fresh pass or a separate subagent when one is available. Look for the control or precondition that makes it unreachable.
5. **Record a verdict.**
   - **Confirmed:** traced, with the result demonstrated or observable by the owner.
   - **Needs validation:** blocked on a fact outside the source, such as deployment configuration or runtime behavior; state the blocker and a safe check the owner can run.
   - **Rejected:** keep the reason, so later runs do not repeat the work.

   Give severity (critical, high, medium, low, informational) only to confirmed findings, and never above the demonstrated impact. Keep likelihood and impact separate from certainty.
6. **Execute safely.** At either depth, before running a project command, scanner or exploit script, read what it executes: the script, its prerequisites, the config it loads and the targets it resolves. Never read and run in the same command. Do not install dependencies, contact deployed or external endpoints, or upload code. Never point a scanner or exploit at a host, database or account that is not plainly local and disposable; say what it would do and ask. Run target code only inside an isolated sandbox with no network, an empty environment, a read-only target and resource limits. Otherwise mark the dependent finding needs validation. Clean up after running. Put scratch files, clones, browser profiles and build output in a temporary directory you create for the task, and delete it when you finish. Stop every process you start, such as dev servers, headless browsers, watchers, emulators and containers, before you finish, including after a failure or timeout. Scripts and tests you write do the same: clean up in a `finally` block or exit trap, and quit any browser or server they launch. Never delete anything you did not create, and report anything you could not remove with its path and size.
7. **Fix at the source.** Describe the smallest effective fix for each finding. Apply fixes only when remediation is authorized, one finding at a time, each with a regression test.

Report what was covered and what was not. One run never exhausts a codebase.

## Verification and reporting

After an authorized correction, rerun the relevant check and read back remote settings. Verify the exact destination, staged revision, and exposure scope before an authorized push. After a timeout, inspect remote branch/tag IDs, release records, workflow conclusions, and published artifacts before retrying a mutation. Identify partial completion and retry only the missing safe step. Never bypass a secret-scanning block merely to finish.

## Delegation

When your host can run a subagent on a cheaper model, hand it the mechanical steps and keep the judgment here. Give it the exact files, the change and the check to run, review what it returns before relying on it, and do a step yourself when it hands that step back. Hand off file and history inventories, scanner runs, and redacted lists of findings. Keep exploitability, trust-boundary, access and disclosure decisions.

## Output

Return the depth chosen and why, scope, findings by impact with locations and evidence, changes made, checks performed, residual risks, and unavailable coverage. For a codebase audit, group findings by verdict, and list the units reviewed and not reviewed. Say “no findings in these checks,” not “secure” or “no secrets exist.” A skill does not enforce a sandbox or grant permissions.

## Escalate

Use deterministic inventory and scanning for routine work. Escalate credible compromise, uncertain exploitability, sensitive access changes, or architecture-level trust decisions to the appropriate maintainer or stronger review path. Model selection remains with the host. Do not buy services, and spawn subagents only for a codebase audit, as described there.

## Sources

The codebase audit method adapts ideas from Cloudflare's security-audit-skill (MIT): https://github.com/cloudflare/security-audit-skill. It is written independently; no upstream text is included, and Cloudflare does not endorse GhostCTO.

For GitHub-specific details, consult current official documentation when needed:
- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning
