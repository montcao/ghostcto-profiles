# Contributing

Keep each profile portable, self-contained, and focused on routine work. Preserve its output contract and escalation boundaries. Update the README when profile names or install instructions change, and describe the checks you actually ran.

Use a Conventional Commit for maintainer commits:

```text
<type>(optional-scope): <short imperative summary>
```

Use `fix` for corrections, `feat` for a new user-visible capability, and `docs` for documentation-only changes. Keep the summary short and lowercase unless a proper noun requires otherwise. Use a breaking-change footer only when the profile contract or required installation behavior truly changes.

Before opening a change, inspect the affected profile and run the relevant format or validation checks. Do not claim remote publication or benchmark results unless they have been verified.

`README.md`, `LICENSE`, `NOTICE`, `skills/`, `assets/`, `plugins/ghostcto/` and `.claude-plugin/marketplace.json` are written by a sync from the private GhostCTO source repository, and a pull request that changes them here fails CI. Open an issue describing the change instead. See [ARCHITECTURE.md](ARCHITECTURE.md), and [AGENTS.md](AGENTS.md) for commands and the claim protocol.
