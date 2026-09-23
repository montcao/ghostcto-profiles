---
name: ghostcto-cicd-infrastructure
description: Create or repair a bounded build, validation, or release pipeline using the repository's existing CI/CD and infrastructure conventions. Use for GitHub Actions hardening, reproducible installs, protected-branch checks, and semantic-release setup; escalate cloud IAM redesign, destructive infrastructure changes, and unapproved production deployment.
license: Apache-2.0
---

# CI/CD Infrastructure

Deliver the smallest pipeline change that meets the requested outcome. Determine the CI provider, runtime, package manager, target branch/environment, existing release policy, and acceptance checks. Honor existing authorization; implementation of a pipeline does not automatically authorize publishing artifacts, expanding cloud access, or deploying production.

## Inspect before changing

Read current workflows, lockfiles, runtime pins, release configuration, and repository rules. Distinguish a failing command from a blocked environment, such as network restrictions, missing credentials, unsupported runtime, or full disk. Do not expose credentials while diagnosing. Preserve user runtime defaults and unrelated files; clean only disposable artifacts created for this task when necessary.

Use the existing stack. Avoid a new installer, orchestration service, cloud provider, or model router for a task that standard CI can handle. Prefer established scripts and deterministic validation over repeated model calls.

## Pipeline design

- Keep validation and publication separate. Run untrusted PR checks with minimal read permissions, no deployment credentials, and an appropriate isolated runner. Do not execute PR-controlled code or blindly consume artifacts/caches in a privileged `pull_request_target` or `workflow_run` job.
- Pin third-party Actions to full commit revisions verified against their official repositories. Use explicit compatible runtimes and locked dependency installs. Disable checkout credential persistence when subsequent Git operations do not require it. Audit lifecycle scripts before opting into or disabling them; do not break required build steps merely to add a flag.
- Give write permissions only to the trusted release job that needs them, after validation. Keep credentials in the host's secret mechanism, out of files, logs, command strings, and artifacts. For cloud authentication, prefer an existing narrowly scoped OIDC setup when available; creating or expanding its trust policy is a separate access decision.
- Pass untrusted text as properly quoted data rather than interpolating expressions into shell code. Define useful timeouts and concurrency behavior; avoid cancelling a production deployment halfway through a stateful operation. Treat dependency changes as reviewable PRs, not automatic merges.
- Match release triggers to branch protections and actual required check names. Preserve signing and review requirements; do not disable security controls to get a green run. A solo maintainer's approval policy must be explicit rather than silently pretending independent review exists.

## Releases and verification

Follow repository release rules. Where semantic-release is used, use Conventional Commits, configure only necessary plugins, and let it derive versions and release notes. Do not manually bump versions or hand-edit generated changelogs unless requested. Keep experimental channels opt-in; do not assume a version tag controls installs from a default branch.

Verify the intended author and committer identity before creating commits. Use a verified account-specific private email or an authorized bot identity, never a fabricated generic noreply address. Preserve required signing; distinguish attribution from cryptographic verification. Published history or tag repairs need explicit authorization, recorded old/new revisions, unchanged-content checks where appropriate, lease-protected updates, restoration of any temporary protection exception, and a consumer-facing correction note. Prefer a forward fix when a rewrite is unnecessary.

Validate syntax and run the actual build/check command in a clean or isolated project. Confirm the intended command runs on the selected runtime. Use dry-run or plan modes where supported, but explain their limits. After an authorized remote run, inspect its conclusion, artifacts, release revision, and relevant protection settings. An uploaded workflow file is not proof that CI passed.

Test a published artifact with the consumer's real installation path, without modifying their normal environment. Compare contents to the reviewed source. On an uncertain push or deployment response, inspect remote branch/tag IDs, release records, workflow conclusions, and package/artifact existence before a retry. Identify partial publication and retry only the missing safe step; do not rerun semantic-release blindly. Do not automatically retry destructive operations or delete tags/history to repair a release.

Return changed files, triggers and permissions, checks and observed outcomes, remaining deployment steps, and recovery options. Escalate missing production authority, destructive infrastructure plans, secret exposure, or failures beyond a bounded targeted repair. Recommend a stronger model only for unresolved design/trust questions; the host controls model selection and budgets.

GitHub reference for trust and permission details:
https://docs.github.com/en/actions/reference/security/secure-use

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.
