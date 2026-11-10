# Contributing

Keep each profile portable, self-contained, and focused on routine work. Preserve its output contract and escalation boundaries. Update the README when profile names or install instructions change, and describe the checks you actually ran.

Use a Conventional Commit for maintainer commits:

```text
<type>(optional-scope): <short imperative summary>
```

Use `fix` for corrections, `feat` for a new user-visible capability, and `docs` for documentation-only changes. Keep the summary short and lowercase unless a proper noun requires otherwise. Use a breaking-change footer only when the profile contract or required installation behavior truly changes. Do not credit an AI model or tool in commits, pull request descriptions or issues; co-authors that are real accounts are fine.

Before opening a change, inspect the affected profile and run the relevant format or validation checks. Do not claim remote publication or benchmark results unless they have been verified.

`README.md`, `LICENSE`, `NOTICE`, `skills/`, `assets/`, `plugins/ghostcto/` and `.claude-plugin/marketplace.json` are written by a sync from the private GhostCTO source repository, and a pull request that changes them here fails CI. Open an issue describing the change instead. See [ARCHITECTURE.md](ARCHITECTURE.md), and [AGENTS.md](AGENTS.md) for commands and the claim protocol.

## Outside contributions and building on other work

To propose a profile, or a change that builds on someone else's work, open an issue first. Say what you want to add, name any source you adapted, and give its license and a link. The maintainers decide how it lands:

- **inspired by:** the ideas are rewritten in GhostCTO's own words and credited.
- **adapted from:** the source's text is included, pinned to a revision, and keeps its own license in [`NOTICE`](NOTICE).
- **works alongside:** the profile links to the separate tool and credits it.

Credits appear in the profile's own instructions and in the README's Credits table. Credit is not endorsement: a profile never uses another organization's name. GhostCTO's own contributions are licensed under Apache-2.0.
