---
name: ghostcto-committer
description: Turn a working tree of finished changes into a reviewable commit or sequence of commits, choosing the split, the type, and a message that states only what was done.
license: Apache-2.0
---

# Committer

Use this skill when work is complete and uncommitted, and the remaining question is how to record it: how many commits, what goes in each, and what each message says. It suits a working tree holding several unrelated changes, a change whose release impact is not obvious, or a repository with commit conventions that must be followed exactly.

Do not use it to write the code, to decide whether the work is correct, or to open, merge, or revert anything. Push only when asked, and then follow Pushing to a ready pull request. Do not use it to rewrite published history. It records finished work; it does not judge it.

## Procedure

1. Read the repository's conventions before writing anything: its contributor guide, any agent instruction file, and the last twenty commit subjects. The repository's existing format wins over any default you would otherwise apply.
2. Inspect the full working tree, staged and unstaged, tracked and untracked. Identify changes that were already present before this task and do not commit them unless asked.
3. Group the changes into the smallest set of commits that each stand alone. A commit that only compiles because a later commit exists is not a separate commit. Where files must move together, say so rather than splitting them.
4. Choose each commit's type from what the change does, not from where the files live. When a commit mixes impacts, take the highest one and state the rest in the body.
5. Never commit to the default branch unless told to, and never bypass commit hooks. If a hook rejects a message, fix the message or report the conflict.
6. Stage each group explicitly by path and commit it. Verify the staged file list before each commit, and confirm the working tree afterwards holds only what you meant to leave.

## Message

Write the subject in the repository's format. Then at most two short paragraphs, and often none.

State what was done. Omit rationale, alternatives considered, verification results, and anything a reader can see in the diff. Do not use adjectives. Do not claim the change is clean, correct, safe, minimal, or robust, and do not assert that checks passed. Cut every word that does not change the meaning.

Explain release impact in the body only when the subject cannot carry it. Use footers only for breaking changes and references.

Never credit an AI model or tool: no `Co-Authored-By` trailer for a model, no `Generated with` line, no tool or model names. Add other trailers or signatures, such as a person's `Co-Authored-By` or a sign-off, only when the repository's conventions require them. History should read the same whichever agent wrote it, so any agent can continue it.

## Pushing to a ready pull request

Every push to a ready pull request starts the repository's full CI run. On a paid plan that spends billed minutes; on a free plan it still spends shared runner time and makes reviewers wait in the queue. Treat a push to a ready pull request as a cost whether or not anyone is billed for it.

1. Before marking a pull request ready (`gh pr ready`), run the checks the repository runs locally: its pre-push hook, the test files that cover the changed code, and its format and docs checks. The first CI run after ready should be the one that passes, not the first of several.
2. Once a pull request is ready, collect every review or CI fix into one commit sequence and push once, not once per fix.
3. If more than small fixes remain after review, return the pull request to draft with `gh pr ready --undo`, push as often as needed, then mark it ready again after rule 1.
4. Before pushing to a ready pull request, state how many pushes it has had since it was marked ready and why this push cannot wait for the rest of the fixes.
5. When work is split into several commits, push them together. The split is for review, not a reason to push each commit separately.

## Output

Report each commit's hash and subject, the files in it, and anything left uncommitted and why. Name any change you grouped against instinct, and any case where the repository's convention conflicted with the requested format so a human can settle it.

## Escalate

Stop and report when the working tree mixes your task with changes you cannot attribute, when a split would leave a commit that does not stand alone, when the release impact depends on a product decision, or when the repository's stated convention and the request disagree. Ask which to follow rather than choosing silently.

This work suits an inexpensive model. If you are running on one and the task needs judgment this profile does not cover, stop and return the reason and your evidence instead of guessing; a stronger model or a person takes it from there.
