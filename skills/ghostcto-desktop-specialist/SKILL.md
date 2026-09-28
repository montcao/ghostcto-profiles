---
name: ghostcto-desktop-specialist
description: Design, review, or implement desktop applications with sound UI, domain, native integration, security, persistence, and release architecture across native, Electron, or Tauri stacks.
license: Apache-2.0
---

# GhostCTO Desktop Specialist

Use this skill when a task involves a desktop application, desktop wrapper, native windowing, Electron, Tauri, or OS integration. Inspect the existing stack, target OS versions, repository conventions and acceptance checks first. Preserve that stack unless a change is necessary and within scope. For new applications, choose from product constraints: native UI when platform fidelity, deep OS integration, or accessibility is central; Electron when web ecosystem and cross-platform velocity dominate; Tauri when a small webview shell with Rust/native commands fits. Do not force a framework.

## Architecture

Separate four concerns and make their dependencies explicit:

- UI/renderers own presentation, interaction state, and navigation.
- Domain/application code owns product rules and use cases, independent of windows and framework APIs.
- Native adapters own filesystem, notifications, menus, deep links, tray, permissions, keychain, and OS lifecycle.
- Persistence owns versioned user data, migrations, backups/recovery behavior, and corruption handling.

Keep the renderer unprivileged. Define a small, typed command/event surface at the UI/native boundary. Validate every argument, result, origin/window identity, authorization decision, and path or URL at the receiving side; return safe errors and avoid exposing generic “execute” or filesystem primitives. Treat IPC as a public API with compatibility and cancellation semantics. For Electron, use preload plus `contextBridge`, `contextIsolation`, sandboxing, restrictive CSP, secure custom protocols, and sender validation. For Tauri, use narrowly scoped commands, capabilities, permissions, and path scopes per window; do not assume a capability boundary survives when windows share merged capabilities.

Treat remote content as untrusted. Prefer bundled local UI. If remote content is required, use HTTPS, explicit origin allowlists, isolated webviews, limited navigation and window creation, and no ambient native privileges. Never put tokens, signing keys, or durable secrets in renderer storage, URLs, logs, or bundled assets. Store credentials in the platform keychain/credential vault through a native adapter, and expose only task-specific operations.

## Runtime behavior

Model app, window, session, and background-worker lifecycles explicitly. Make startup idempotent; handle single-instance activation, deep links, sleep/wake, offline mode, shutdown, and crash recovery. Every async operation that can outlive a view needs cancellation, timeout, ownership, and a defined result when its window closes. Keep long work out of the UI thread; use an appropriate worker/process and report progress without retaining dead window references. Make permission prompts and destructive actions visible, understandable, and user initiated.

Persist user data in OS-appropriate application-data locations, with atomic writes, schema versions, forward migrations, and a recovery path for partial or corrupt state. Keep cache, preferences, secrets, and user documents separate. Do not silently discard data during migrations; record actionable diagnostics without logging sensitive values.

## Native product quality

Follow platform conventions for menus, dialogs, focus, window sizing, title bars, shortcuts, drag/drop, notifications, context menus, and reduced motion/high contrast. Ensure keyboard-only operation, visible focus, semantic labels, screen-reader behavior, scalable text, and localization. Test on each supported OS and with a fresh profile, upgraded profile, offline state, sleep/wake, multiple windows, and failed permission or update flows.

## Packaging and release

Build reproducibly for each target, pin and audit dependencies, minimize bundled privileges, and produce signed artifacts with provenance. Preserve the repository’s existing signing, release, and approval authority; never disable verification, notarization, policy checks, or update safeguards to make a build pass. Design updates as authenticated, rollback-aware migrations with clear user messaging; verify signatures and metadata before installation, and keep platform-specific update constraints explicit. Treat installers, auto-updaters, native modules, and embedded runtimes as part of the attack surface.

## Verification and handoff

Use the existing build, typecheck and test commands; verify the actual app flow on available target platforms and distinguish source checks from a signed packaged build. Report unavailable OS or signing coverage rather than claiming cross-platform readiness. Scale lifecycle and migration tests to the touched boundaries. As a delegated worker, honor assigned paths, acceptance checks and budget; do not spawn nested workers without explicit authority. Return changed files, architecture decisions, checks with results, platform limitations and remaining release steps. A skill does not create workers or grant native permissions.

If you commit, match the repository's existing commit conventions. Read recent history and any contributor guide; do not impose a format of your own.

## Sources and limits

Security decisions here follow the current official [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security), [Electron context isolation guidance](https://www.electronjs.org/docs/latest/tutorial/context-isolation), [Electron distribution guidance](https://www.electronjs.org/docs/latest/tutorial/distribution-overview), and Tauri’s [capabilities](https://tauri.app/security/capabilities/), [permissions](https://tauri.app/security/permissions/), and [distribution](https://tauri.app/distribute/) documentation. These sources describe framework mechanisms, not a complete threat model or platform UX specification; verify target-OS requirements, framework versions, signing authority, and repository policy before shipping.
