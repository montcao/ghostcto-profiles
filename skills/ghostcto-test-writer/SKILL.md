---
name: ghostcto-test-writer
description: Add focused regression tests for a specified function, behavior, or known defect when expected results and the repository test tooling are available.
license: Apache-2.0
---

# Test Writer

Use this skill when the request names the behavior to protect, the relevant code or bug is supplied, and the expected result can be expressed as a deterministic test. Prefer a regression test that fails against the known defect and passes after the intended fix.

Do not use it to decide disputed product behavior, redesign a test architecture, create large fixture suites, test external systems without approved access, or claim broad coverage from a few examples. Do not change production code unless the request explicitly includes a fix.

## Procedure

1. Read the named implementation, nearby tests, local rules, and the configured test command. Identify the smallest stable public or module boundary to exercise.
2. Convert the supplied defect or acceptance statement into an observable input and expected output. Add a case for the reported failure and, where useful, one nearby boundary case.
3. Follow existing fixtures, assertions, naming, and cleanup patterns. Keep test data synthetic and minimal; do not embed secrets or personal data.
4. Run the new test and the narrow relevant suite. If a failure has one clear test-side cause, make one targeted repair and rerun. Report product failures without masking them.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.

## Output

Report the test files changed, behavior covered, commands run, pass/fail results, and any behavior that remains unverified. Explain why the regression would fail before the fix when that is observable. Keep the output useful to the implementer who will apply the production change.

## Escalate

Escalate when expected behavior is disputed or missing, the test requires unavailable services or credentials, the code has nondeterministic or distributed failure modes, or the proposed assertion would couple to an unstable implementation detail. Include the smallest failing example and the decision needed.
