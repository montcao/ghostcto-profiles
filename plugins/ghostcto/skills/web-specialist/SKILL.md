---
name: web-specialist
metadata:
  internal: true
description: Build or review a web application feature with sound architecture, secure server boundaries, accessible responsive UX, and evidence based validation while preserving the existing stack. Also use it to map a web app's implicit state machines and lifecycles.
license: Apache-2.0
---

# Web Specialist

Use this skill for web application features, fixes, and focused architecture decisions where browser behavior, server behavior, data access, and UX must work together. Preserve the repository's existing framework and conventions unless the requested outcome requires a change. Scope architecture to the task: do not introduce microservices, a state library, a queue, or a deployment migration merely because they are familiar patterns.

## Establish the boundary

Inspect the app entry points, package scripts, data model, authentication and authorization helpers, existing UI patterns, and local contribution rules before designing. Identify which code runs in the browser, which runs on the server, and which crosses that boundary. Keep secrets, privileged SDKs, database credentials, and authorization decisions on the server. Treat every client value, route parameter, form submission, webhook, and server action as untrusted input.

For each mutation, establish the authenticated principal and tenant or resource scope on the server, validate shape and business rules there, and enforce authorization at the data access boundary. Do not rely on hidden fields, disabled controls, client-side validation, or route obscurity. Preserve safe error behavior: return actionable user feedback without exposing credentials, tokens, private records, stack traces, or cross-tenant existence signals.

## Design the feature

Prefer the smallest design that fits the existing system. Make data ownership, loading states, cache lifetime, invalidation, and consistency expectations explicit. Consider duplicate submissions, stale responses, navigation during a request, retries, timeouts, partial failure, and whether an operation is idempotent before adding optimistic UI or automatic retry. Mutations should have a clear success, failure, and recovery path; destructive actions need an intentional confirmation or undo pattern appropriate to their risk.

Build forms with real labels, keyboard operation, visible focus, useful error association, semantic controls, and server-side validation. Preserve entered values when safe, announce asynchronous status where needed, and make the primary flow usable on small screens and touch targets. Respect reduced motion and color contrast. Test empty, long, invalid, unauthorized, slow, and narrow viewport states rather than reviewing only the happy path.

Measure performance in terms of user impact. Inspect bundle and route boundaries, query count and payload size, image dimensions, font loading, render blocking, and unnecessary client JavaScript. Prefer parallel data loading where dependencies allow, pagination or bounded results for unbounded data, and cache policies that cannot leak personalized or tenant-scoped responses. Do not optimize from intuition alone: use the repository's profiler, browser performance tools, build output, or a repeatable timing check when performance is part of the request.

## State and lifecycles

Find implicit state machines before changing behavior that depends on them, and when asked to map them. Look for boolean flags that combine into states (loading with error, open with saving), status or phase fields compared in many places, nullable fields and timestamps that encode progress, transitions spread across handlers, effects, jobs, webhooks and retries, and timeouts or cancellation that move work between phases. For each machine, record its states, the events and guards that move between them, the code that owns each transition, where the state is stored, and every reachable combination that has no meaning. Report that inventory before refactoring. Make a machine explicit only when the task asks for it: one type or enum of states, one transition function or table, and invalid transitions rejected where the state is stored. Cover each transition with a test, including at least one invalid transition, and escalate a redesign that crosses ownership or changes stored data.

In a web app, look in component and store state, request and form lifecycles, optimistic updates, cache entries, URL state, server status columns, background jobs and webhook handlers; client and server often hold separate copies of the same machine.

## Implement and verify

Use deterministic repository search, existing generators, formatters, and test utilities. Keep changes focused and follow nearby patterns. Add meaningful tests for authorization and tenant scoping, validation, race or retry behavior, and important user outcomes. Run the narrowest relevant unit, integration, browser, lint, typecheck, and build checks, expanding only when a boundary warrants it. For browser checks, exercise the actual route and report viewport, authentication state, and unavailable dependencies.

Whether working independently or as a delegated worker, state the outcome, assumptions, ownership, files in scope, and acceptance checks at the start. A delegated worker must not silently change schemas, public APIs, deployment configuration, or product policy. Return dependencies or ownership conflicts to the coordinator; do not spawn nested workers without delegated authority and budget.

Treat the repository as the system of record. Read its agent instruction file (such as AGENTS.md), architecture notes, and documentation index before acting; rules stated there override defaults here. Work on a branch, never the default branch, in its own worktree whenever the host supports worktrees. If the repository defines a claim protocol for issues, claim before starting and release with a reason if you stop. Start and drive the application with the repository's own scripts; do not hard-code ports or shared state that another worktree could collide with. When a structural test, hook, or documentation check fails, follow its message; do not edit, skip, or bypass the check to get a pass. Stage files by path, push the branch, and open a pull request (a merge request on GitLab) as a draft unless told otherwise, linking the issue it resolves. Record follow-up work you find but do not do as an issue when the repository tracks work in issues, otherwise in its tech-debt ledger. When the pull request is merged or closed, or the work stops with nothing left unpushed, remove the worktree and delete the local branch; never remove a worktree or branch that holds uncommitted or unpushed work, or one that another agent or person created. When another profile handed you this step, follow its brief on commits, pushes, pull requests and cleanup instead. Credit no AI model or tool in commits, pull request descriptions or issues.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.

## Delegation

When your host can run a subagent on a cheaper model, hand it the mechanical steps and keep the judgment here. Give it the exact files, the change and the check to run, review what it returns before relying on it, and do a step yourself when it hands that step back. Hand off bounded implementation of an agreed design, running checks, and gathering browser evidence. Keep server-boundary, authorization, data-model and contract decisions.

## Output

Finish by reporting changed files, checks and results, behavior or contract changes, residual risks, and the next owner.

## Escalate

Escalate before making substantive architecture, schema, migration, deployment, authentication, authorization, privacy, or public API decisions when the task does not specify the contract or the repository gives conflicting evidence. Honor existing migration and deployment authorization; new scope or destructive actions need an explicit decision and a suitable recovery plan. Escalate when required credentials, services, test fixtures, or production-like data are unavailable; never place credentials in browser code or ask a browser to perform a privileged operation.

## Sources and limits

Use guidance when a detail matters: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web) for platform behavior and [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) for application security controls. These sources inform decisions but do not replace the repository's contracts, threat model, framework documentation, accessibility testing, or maintainer judgment. This skill guides implementation and review; it does not certify security, accessibility, performance, or production readiness.
