# Tech debt and open decisions

Each row says what would close it. Remove a row in the change that closes it.

## Open decisions

| Item | Why it is open | What closes it |
| --- | --- | --- |
| Make `pr-title` a required status check | The workflow must exist on `main` before branch protection can require it | After the harness PR merges: add `pr-title` to the required checks for `main` |
| Merge order for the duplicate-skill fix | `validate` and the discovery check expect the fixed plugin copies; `main` still has the v1.3.0 copies | Merge the private source fix, then its sync PR here, then the harness PR |
| Required reviews stay at 0 | Solo maintainer; a required approval would block every merge | Raise to 1 when a second maintainer joins |
| Agent bounds cover Claude Code only | `.claude/settings.json` is the only versioned host config | Add the equivalent for another host when one is used here |

## Gaps

| Gap | What closes it |
| --- | --- |
| Dependabot security-update jobs fail (postcss-selector-parser, brace-expansion, ip-address; since at least 2026-11-03) | Read a failed "Dependabot Updates" run log and fix the cause, or document why those updates cannot apply |
| No real `/plugin install ghostcto@ghostcto-profiles` recorded | Install in Claude Code from this repository and record the version and date in the private catalog |
| `ghostcto-harness-engineer` install not verified; catalog still preview | `npx skills add montcao/ghostcto-profiles --skill ghostcto-harness-engineer`, then flip it to published in the private source |
| Plugin has no icon | Add a square PNG; the private export currently rejects binary files |
| No quality grades or behavioral evaluations | Run each profile against fixed tasks; record pass, retries and escalations per profile in a quality ledger under `docs/plans/` |
| Every index row is "edited"; none "read" | Run the doc-gardener prompt over all rows |
| Git hooks are opt-in per clone | Each clone runs `npm run hooks`; CI runs the same checks regardless |
