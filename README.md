# GhostCTO profiles

GhostCTO profiles by Montcao are portable [Agent Skills](https://agentskills.io/) for bounded software work. Each profile gives a compatible agent a focused workflow for one kind of task. A profile does not create an agent process, choose a model, change host permissions, or install anything by itself.

## Install

The tested `skills` CLI (1.7.0) requires Node.js 22.20.0 or newer and Git. From your project directory, install one profile with:

```sh
npx skills add montcao/ghostcto-profiles --skill ghostcto-developer
```

Replace `ghostcto-developer` with another profile name from the catalog below. The CLI is interactive; review its target and confirmation prompts before accepting them.

To install from a local clone of this repository, run this command from the clone root:

```sh
npx skills add . --skill ghostcto-developer
```

Remote installation was verified for the first eight profiles with skills CLI 1.7.0, Node.js 22.21.1, and the Codex installation target. This confirms distribution, not task quality or cost savings. The three application specialists are newly published and their remote installation has not been verified yet; treat them as untested for distribution until this note says otherwise. For a safe local test, use a temporary project rather than your normal agent setup.

## Profiles

<p>
  <img src="assets/developer.svg" width="110" alt="Developer ghost" />
  <img src="assets/test-writer.svg" width="110" alt="Test Writer ghost" />
  <img src="assets/docs-writer.svg" width="110" alt="Docs Writer ghost" />
  <img src="assets/issue-triager.svg" width="110" alt="Issue Triager ghost" />
  <img src="assets/pr-summarizer.svg" width="110" alt="PR Summarizer ghost" />
  <img src="assets/lint-fixer.svg" width="110" alt="Lint Fixer ghost" />
  <img src="https://raw.githubusercontent.com/montcao/ghostcto-profiles/main/assets/security.svg" width="110" alt="Security ghost" />
  <img src="https://raw.githubusercontent.com/montcao/ghostcto-profiles/main/assets/cicd-infrastructure.svg" width="110" alt="CI/CD Infrastructure ghost" />
  <img src="https://raw.githubusercontent.com/montcao/ghostcto-profiles/main/assets/mcp-apps-specialist.svg" width="110" alt="MCP Apps Specialist ghost" />
  <img src="https://raw.githubusercontent.com/montcao/ghostcto-profiles/main/assets/web-specialist.svg" width="110" alt="Web Specialist ghost" />
  <img src="https://raw.githubusercontent.com/montcao/ghostcto-profiles/main/assets/desktop-specialist.svg" width="110" alt="Desktop Specialist ghost" />
</p>

| Profile | Use it for |
| --- | --- |
| `ghostcto-developer` | One small, clearly specified implementation change |
| `ghostcto-test-writer` | Focused regression tests for a specified behavior or defect |
| `ghostcto-docs-writer` | Documentation grounded in code or an approved diff |
| `ghostcto-issue-triager` | Evidence-based summaries and suggested labels for supplied issues |
| `ghostcto-pr-summarizer` | A factual summary of a supplied diff and its checks |
| `ghostcto-lint-fixer` | Mechanical fixes for an explicit diagnostic set |
| `ghostcto-security` | Scoped exposure reviews and authorized repository hardening |
| `ghostcto-cicd-infrastructure` | Bounded CI/CD repairs, validation, and release workflows |
| `ghostcto-mcp-apps-specialist` | MCP app architecture, implementation, and verification boundaries |
| `ghostcto-web-specialist` | Web application work across client, server, and tenant isolation |
| `ghostcto-desktop-specialist` | Desktop application work including process and IPC boundaries |

The first eight are task profiles for a single kind of work. The three specialists are broader application profiles, scoped to one platform.

These profiles are intentionally limited to routine, bounded work. They should escalate unclear requirements, broad architecture changes, security-sensitive decisions, and work that exceeds the profile's output contract. Review generated changes and run the repository's own checks.

No universal quality, cost, speed, or model-performance claim has been established for these profiles. Evaluate them with the same task inputs, tools, and checks as a baseline, and record failures, retries, escalation, latency, and review effort. Treat unavailable model or host coverage as untested rather than estimating savings.

## License

The profile content is available under the Apache License, Version 2.0 in [`LICENSE`](LICENSE). Dependencies, host tools, and the upstream `skills` CLI retain their own terms.

The Apache-2.0 license applies from this license-change revision onward. Earlier tagged releases retain their original MIT license. See [`NOTICE`](NOTICE) for attribution. Third-party licenses are unchanged.
