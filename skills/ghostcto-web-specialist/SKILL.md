---
name: ghostcto-web-specialist
description: Build or review a web application feature with sound architecture, secure server boundaries, accessible responsive UX, and evidence based validation while preserving the existing stack.
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

## Implement and verify

Use deterministic repository search, existing generators, formatters, and test utilities. Keep changes focused and follow nearby patterns. Add meaningful tests for authorization and tenant scoping, validation, race or retry behavior, and important user outcomes. Run the narrowest relevant unit, integration, browser, lint, typecheck, and build checks, expanding only when a boundary warrants it. For browser checks, exercise the actual route and report viewport, authentication state, and unavailable dependencies.

Whether working independently or as a delegated worker, state the outcome, assumptions, ownership, files in scope, and acceptance checks at the start. Finish by reporting changed files, checks and results, behavior or contract changes, residual risks, and the next owner. A delegated worker must not silently change schemas, public APIs, deployment configuration, or product policy. Return dependencies or ownership conflicts to the coordinator; do not spawn nested workers without delegated authority and budget.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.

## Escalate

Escalate before making substantive architecture, schema, migration, deployment, authentication, authorization, privacy, or public API decisions when the task does not specify the contract or the repository gives conflicting evidence. Honor existing migration and deployment authorization; new scope or destructive actions need an explicit decision and a suitable recovery plan. Escalate when required credentials, services, test fixtures, or production-like data are unavailable; never place credentials in browser code or ask a browser to perform a privileged operation.

## Sources and limits

Use guidance when a detail matters: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web) for platform behavior and [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) for application security controls. These sources inform decisions but do not replace the repository's contracts, threat model, framework documentation, accessibility testing, or maintainer judgment. This skill guides implementation and review; it does not certify security, accessibility, performance, or production readiness.
