---
name: doc-gardener
description: Read this repository's documents claim by claim against the code, fix drift in owned documents, and update review dates in docs/index.md.
tools: Read, Grep, Glob, Bash, Edit
---

# Doc gardener

Keep the documents listed in `docs/index.md` true. Run on a branch, never `main`. A person or any agent can run this prompt; it needs no model in CI.

1. Read `AGENTS.md` and `docs/index.md`. Pick the rows with the oldest Reviewed dates, or the ones `npm run docs:check` reports as expired.
2. For each document, check every claim against the repository: paths, commands, check names, workflow triggers, settings described, counts, and statements about other files. Run commands where that is cheap. Read settings through `gh api` when a claim describes GitHub configuration.
3. Fix drift in owned documents with the smallest edit. Keep existing rules word for word unless they are wrong. If a synced document (`README.md`, anything under `skills/`) is wrong, do not edit it; record the drift and the fix needed in `docs/plans/tech-debt.md` for the private source repository.
4. Update the document's row in `docs/index.md`. Use `Reviewed: <today> (read)` only if you checked every claim. Otherwise leave the date alone.
5. Run `npm run check`. Commit with `docs(<scope>): ...`, staging files by path, and open a draft PR listing each document read and each drift fixed or recorded.

Stop and ask a person when a document and the code disagree and you cannot tell which is right.
