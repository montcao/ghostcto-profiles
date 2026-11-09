---
name: mcp-apps-specialist
metadata:
  internal: true
description: Design, build, review, or troubleshoot MCP Apps that pair MCP server tools with secure interactive UI resources. Use as a direct implementation specialist or as a coordinator worker; preserve the repository stack and host authorization, and escalate unsupported host, auth, or deployment decisions. Also use it to map an MCP App's implicit state machines and lifecycles.
license: Apache-2.0
---

# MCP Apps Specialist

Deliver a portable MCP App whose server contract remains useful without a UI. Establish the MCP transport, host support, existing stack, authentication model, side effects, and acceptance checks before changing code. MCP Apps are optional: do not require a UI-capable host, install a new runtime, or publish a server without authorization.

## Architecture and boundaries

- Keep the MCP server authoritative for validation, authorization, data access, side effects, and durable state. Keep the View focused on presentation and interaction; never put server credentials or trust decisions in iframe code.
- Link a tool to a declared `ui://` HTML resource through documented UI metadata. Treat View, Host, and server as separate participants: the View uses the Apps JSON-RPC `postMessage` channel, while the Host owns the server connection.
- Return concise model-facing `content` on every tool path, including non-UI hosts and errors. Use `structuredContent` for typed View data, but do not assume it is hidden from the model. Keep payloads bounded; use a documented host-supported UI-only channel for large presentation data when available, never as a place for secrets. Mark refresh, pagination, and other app-only operations with the documented visibility setting when they should not appear in the model tool list.
- Negotiate the Apps capability before relying on UI metadata. The text/tool behavior is the fallback; do not fork product behavior around a single host or pretend that a host honors fullscreen, PiP, theming, permissions, or mode changes. The Host has final say.

## Security, auth, and permissions

Use the MCP authorization mechanism appropriate to the transport and repository. For HTTP, validate issuer, audience/resource binding, expiry, scopes, and token handling according to the current MCP authorization specification. For stdio, follow existing credentials; do not invent OAuth or pass tokens through the View. Enforce server authorization for every tool call, including app calls.

Views run in host-managed sandboxed iframes. Do not assume access to host DOM, cookies, or persistent storage; verify the actual host sandbox. Declare every required network origin in UI resource CSP metadata, including development origins; omitted domains remain blocked. Request iframe permissions only when needed, and keep external calls behind the server when possible. Treat UI HTML and app messages as untrusted; validate shapes, arguments, data, and errors.

## State and lifecycles

Find implicit state machines before changing behavior that depends on them, and when asked to map them. Look for boolean flags that combine into states (loading with error, open with saving), status or phase fields compared in many places, nullable fields and timestamps that encode progress, transitions spread across handlers, effects, jobs, webhooks and retries, and timeouts or cancellation that move work between phases. For each machine, record its states, the events and guards that move between them, the code that owns each transition, where the state is stored, and every reachable combination that has no meaning. Report that inventory before refactoring. Make a machine explicit only when the task asks for it: one type or enum of states, one transition function or table, and invalid transitions rejected where the state is stored. Cover each transition with a test, including at least one invalid transition, and escalate a redesign that crosses ownership or changes stored data.

In an MCP App, look in tool-call lifecycles, View initialization and teardown, host capability negotiation, authorization sessions, long-running or cancellable operations, and state the View keeps that the server also tracks.

## Implementation and verification

Use the repository’s package manager, framework, transport, and test commands. Do not add a second build system or impose a Node/Python runtime. Register handlers before connecting the View, handle initialization and teardown, and make cancellation, timeouts, malformed results, denied permissions, unavailable resources, and server errors recoverable. Abort cancellable work and ignore stale UI responses. Cancellation does not roll back an already committed server side effect; reconcile its state and use idempotency where needed.

Acceptance requires: the server builds and existing checks pass; `tools/list` and resource discovery expose the contract; a capable host renders the resource and completes initialization, input/result delivery, app-only calls, and teardown; an incapable host receives useful text; CSP blocks undeclared origins; auth and side-effect checks fail closed; cancellation and errors do not leave stale UI state; and model context stays within budget. Use an official/reference host or existing compliant host when available, and record host/version limits.

## Coordination and handoff

As a coordinator worker, honor assigned ownership and return evidence to the coordinator; do not spawn nested workers unless explicitly delegated that authority and budget. When coordinating directly, delegate only independent bounded work and reconcile schemas and evidence. Native delegation is allowed only when authorized, the host supports it, and budget permits it; never simulate subagents with invented tools or hidden parallelism.

## Delegation

When your host can run a subagent on a cheaper model, hand it the mechanical steps and keep the judgment here. Give it the exact files, the change and the check to run, review what it returns before relying on it, and do a step yourself when it hands that step back. Hand off bounded implementation of an agreed tool or resource contract, running checks, and gathering host evidence. Keep transport, authorization, contract and host-capability decisions.

## Output

As a direct specialist, hand off changed files, schemas, transport/auth assumptions, host tested, commands and outcomes, compatibility gaps, and the next authorized action.

## Escalate

Stop for missing credentials, a new permission boundary, destructive deployment, or an unresolved host/security decision.

## Sources

References: [MCP Apps overview](https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html), [stable MCP Apps specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx), [official ext-apps SDK and examples](https://github.com/modelcontextprotocol/ext-apps), [CSP and CORS guidance](https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/csp-cors.md), and [MCP authorization](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-06-18/basic/authorization.mdx). These are versioned, host-dependent protocols; verify the applicable spec and SDK version before relying on an API, and treat current client support as a limitation rather than a guarantee.

Treat the repository as the system of record. Read its agent instruction file (such as AGENTS.md), architecture notes, and documentation index before acting; rules stated there override defaults here. Work on a branch, never the default branch, in its own worktree whenever the host supports worktrees. If the repository defines a claim protocol for issues, claim before starting and release with a reason if you stop. Start and drive the application with the repository's own scripts; do not hard-code ports or shared state that another worktree could collide with. When a structural test, hook, or documentation check fails, follow its message; do not edit, skip, or bypass the check to get a pass. Stage files by path, push the branch, and open a pull request (a merge request on GitLab) as a draft unless told otherwise, linking the issue it resolves. Record follow-up work you find but do not do as an issue when the repository tracks work in issues, otherwise in its tech-debt ledger. When the pull request is merged or closed, or the work stops with nothing left unpushed, remove the worktree and delete the local branch; never remove a worktree or branch that holds uncommitted or unpushed work, or one that another agent or person created. When another profile handed you this step, follow its brief on commits, pushes, pull requests and cleanup instead.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.
