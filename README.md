# GhostCTO profiles

GhostCTO profiles by Montcao are portable [Agent Skills](https://agentskills.io/) for bounded software work. Each profile gives a compatible agent a focused workflow for one kind of task. A profile does not create an agent process, choose a model, change host permissions, or install anything by itself.

## Install

The tested `skills` CLI (1.7.0) requires Node.js 22.20.0 or newer and Git. From a published checkout, install one profile with:

```sh
npx skills add montcao/ghostcto-profiles --skill ghostcto-developer
```

Replace `ghostcto-developer` with another profile name from the catalog below. The CLI is interactive; review its target and confirmation prompts before accepting them.

To install from a local clone of this repository, run this command from the clone root:

```sh
npx skills add . --skill ghostcto-developer
```

The public repository is still being prepared. The published command above is the intended source form and has not been remotely verified here. For a safe local test, use a temporary project with isolated CLI configuration rather than your normal agent setup.

## Profiles

<p>
  <img src="assets/developer.svg" width="110" alt="Developer ghost" />
  <img src="assets/test-writer.svg" width="110" alt="Test Writer ghost" />
  <img src="assets/docs-writer.svg" width="110" alt="Docs Writer ghost" />
  <img src="assets/issue-triager.svg" width="110" alt="Issue Triager ghost" />
  <img src="assets/pr-summarizer.svg" width="110" alt="PR Summarizer ghost" />
  <img src="assets/lint-fixer.svg" width="110" alt="Lint Fixer ghost" />
</p>

| Profile | Use it for |
| --- | --- |
| `ghostcto-developer` | One small, clearly specified implementation change |
| `ghostcto-test-writer` | Focused regression tests for a specified behavior or defect |
| `ghostcto-docs-writer` | Documentation grounded in code or an approved diff |
| `ghostcto-issue-triager` | Evidence-based summaries and suggested labels for supplied issues |
| `ghostcto-pr-summarizer` | A factual summary of a supplied diff and its checks |
| `ghostcto-lint-fixer` | Mechanical fixes for an explicit diagnostic set |

These profiles are intentionally limited to routine, bounded work. They should escalate unclear requirements, broad architecture changes, security-sensitive decisions, and work that exceeds the profile's output contract. Review generated changes and run the repository's own checks.

No universal quality, cost, speed, or model-performance claim has been established for these profiles. Evaluate them with the same task inputs, tools, and checks as a baseline, and record failures, retries, escalation, latency, and review effort. Treat unavailable model or host coverage as untested rather than estimating savings.

## License

The profile content is available under the MIT License in [`LICENSE`](LICENSE). Dependencies, host tools, and the upstream `skills` CLI retain their own terms.
