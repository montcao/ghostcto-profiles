# Web design review checklist

Work top to bottom. Record each answer as measured, approximate (from a screenshot), or not checked. A checked box means you looked and recorded a value, not that the page passed.

## Before you start

- [ ] Goal, audience and the identity to keep are written down in one or two sentences.
- [ ] Scope is clear: audit only, or which pages and components may change.
- [ ] Project design config, tokens and any design document have been read.
- [ ] Viewports chosen: at least 320, one phone width, one tablet width, one desktop width, plus just above and below each existing breakpoint.
- [ ] Measurement method stated: computed styles and bounding boxes, or screenshot (approximate; zoom and device pixel ratio noted).

## Baseline measurements

- [ ] Root font size, and whether the page overrides the browser default.
- [ ] Per text role (body, small, each heading level, labels, buttons): family, weight, size, line height, letter spacing.
- [ ] Characters per line for the main reading text at each viewport, counted on real lines.
- [ ] Container width, outer gutters, column count, column gap.
- [ ] Section padding and the gaps between related and unrelated elements.
- [ ] Component dimensions and states: default, hover, focus, active, disabled, error.
- [ ] Existing breakpoints and what changes at each.

## Typography

- [ ] Body size suits the reading conditions (starting range 16 to 20 px for continuous reading).
- [ ] Body line height and measure sit in their starting ranges, or the exception has a reason.
- [ ] Heading ratios follow one strategy (restrained or a modular scale); the number of distinct sizes is small.
- [ ] Fluid sizes use `clamp()` with a rem part, and grow at 200% zoom.
- [ ] Heading levels are semantic (one main heading, no skipped levels for styling).
- [ ] Root font size is not shrunk; user font preferences are respected.
- [ ] No essential information appears only in very small text.

## Spacing

- [ ] Spacing values come from a small set of steps; exceptions are named.
- [ ] Gaps between groups are clearly larger than gaps within groups (proximity ratio about 1.5 to 3 as a start).
- [ ] Outer padding and inner gaps are separate decisions.
- [ ] Section padding fractions are consistent with neighbouring sections, or the difference is deliberate.

## Layout and alignment

- [ ] Column widths follow from container, gutter and gap.
- [ ] Shared edges line up; each misalignment is measured (Δx in px and in units) and classified as intentional, accidental or optical.
- [ ] Content widths fit their purpose: reading text, forms, media, tables.
- [ ] Nested containers do not eat the reading width.

## Responsive behavior

- [ ] Navigation collapses before its required width is reached, measured with real labels.
- [ ] Grid columns drop before cards fall below their minimum usable width.
- [ ] No horizontal scrolling at 320 CSS px except content that needs two dimensions (WCAG 1.4.10 Reflow, AA).
- [ ] Text resized to 200% works without loss of content or function (WCAG 1.4.4 Resize Text, AA).
- [ ] Text spacing overrides do not break the layout: line height 1.5, paragraph spacing 2 em, letter spacing 0.12 em, word spacing 0.16 em (WCAG 1.4.12 Text Spacing, AA).
- [ ] Expanded mobile menu, long labels, long words, error messages and real content all fit.

## Hierarchy and containers

- [ ] One element is clearly dominant where the page has a main message.
- [ ] Each border, card and background helps grouping; remove the ones that do not.
- [ ] What draws the eye first, second and third is described in words, without a score.

## Colour and controls

- [ ] Text contrast at least 4.5:1, large text at least 3:1 (WCAG 1.4.3, AA), measured on the real background.
- [ ] Control boundaries, states and needed graphics at least 3:1 against adjacent colours (WCAG 1.4.11, AA).
- [ ] Gradients, transparency, images and animation frames checked at their worst point.
- [ ] Colour is not the only way state or meaning is shown.
- [ ] Focus is visible on every interactive element (WCAG 2.4.7, AA) and not entirely hidden by sticky headers, banners or overlays (WCAG 2.4.11, AA).
- [ ] Targets are at least 24 by 24 CSS px or meet a listed exception (WCAG 2.5.8, AA). 44 to 48 px is a comfort recommendation for touch, not an AA requirement (44 px is the AAA criterion 2.5.5).
- [ ] Every input has a real label; everything works by keyboard.

## Motion

- [ ] Each animation's duration, delay, amplitude, opacity range and phase are stated.
- [ ] Moving content stays clear of text being read; the worst-case frame was checked.
- [ ] `prefers-reduced-motion` is honoured; the content works with motion off.
- [ ] Automatic motion over 5 seconds alongside other content can be paused, stopped or hidden (WCAG 2.2.2, A).
- [ ] Interaction-triggered motion can be disabled (WCAG 2.3.3, AAA; recommended).
- [ ] Offscreen animation pauses.

## Copy, identity and conversion

- [ ] Each section answers a question a visitor brings; sections that answer none are flagged.
- [ ] Brand voice and valued assets are kept; composition was diagnosed before suggesting new fonts or colours.
- [ ] Claims and evidence are real; placeholders are not presented as testimonials, logos or numbers.
- [ ] Any expected effect on sign-ups or sales is written as a hypothesis with a metric.

## Implementation and verification

- [ ] Changes are made in shared tokens or components where possible.
- [ ] Every page using a changed component was checked.
- [ ] No leftover overrides fight the new values.
- [ ] Computed values were re-measured after the change, at the same viewports as the baseline.
- [ ] Report separates measured, required, starting-range, project-decision and hypothesis values.
