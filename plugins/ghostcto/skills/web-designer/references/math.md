# Design maths: formulas, assumptions and worked examples

These formulas help you diagnose a layout and compare options with numbers instead of adjectives. They do not prove that a design is good. Every range below is a **starting range** unless it is marked as a **WCAG requirement**. All lengths are CSS pixels (px) unless stated; 1 rem is the root font size, 16 px in browsers at their default setting.

The worked examples use invented values. Their arithmetic was checked by computing it; recheck yours the same way rather than by eye.

## 1. Typography

### Symbols

| Symbol | Meaning |
| --- | --- |
| B | Body font size |
| H_i | Size of heading level i |
| R_i = H_i / B | Heading-to-body ratio |
| L = line-height / font-size | Unitless line-height ratio |
| M | Characters per line (the measure), counting spaces |
| T | Letter spacing in em (0.02em = 2% of the font size) |

### Starting ranges

- Continuous reading: B about 16 to 20 px. Dense interfaces: 14 to 16 px, checked with real content at real distance. Smaller annotation text is the exception and is never the only place essential information appears. None of these is a WCAG minimum; WCAG sets no minimum font size.
- Body L about 1.45 to 1.65. Short headings L about 1.05 to 1.3. Long headings that wrap to three lines or more need more.
- Measure M about 45 to 75 characters, often 55 to 70 for prose.
- Large display text often needs slightly negative T; small text in capitals often needs slightly positive T. Measure the font, do not assume.

### Measuring line length

M ≈ text width ÷ average character width. For many Latin text faces the average character is roughly 0.45 to 0.55 em, but this varies by typeface; count characters on real rendered lines when it matters.

The CSS `ch` unit is the width of the zero glyph "0" in the current font. It is an approximation of average character width, not a character count: in many fonts "0" is wider than an average lowercase letter, so `max-width: 65ch` often holds somewhat more than 65 characters. Verify by counting.

### Two hierarchy strategies

- **Restrained.** R_i about 1.0 to 1.25. Hierarchy comes from weight, placement, colour and space. Suits dense interfaces, documentation and quiet brands.
- **Expressive modular scale.** S_n = B × r^n, where r is the ratio and n the step.

Worked example: B = 17 px.

| Step n | r = 1.125 | r = 1.25 |
| --- | --- | --- |
| 0 | 17 | 17 |
| 1 | 19.125 | 21.25 |
| 2 | 21.516 | 26.563 |
| 3 | 24.205 | 33.203 |
| 4 | | 41.504 |

Round to whole or half pixels (or equivalent rem) after choosing, and use only the steps the content needs. A scale is a starting point; adjust a step when a real heading wraps badly.

### Fluid type

To grow a size linearly from F_min at viewport width W_min to F_max at W_max:

```
slope     = (F_max − F_min) / (W_max − W_min)
intercept = F_min − slope × W_min
F(W)      = clamp(F_min, intercept + slope × W, F_max)
```

In CSS, `slope × W` becomes `(slope × 100)vw`, and the intercept should be in rem so the size still responds to browser zoom and font settings:

```
font-size: clamp(F_min_rem, intercept_rem + (slope × 100)vw, F_max_rem);
```

Worked example, body: F_min = 16 px at W_min = 360, F_max = 20 px at W_max = 1280.

- slope = (20 − 16) / (1280 − 360) = 4 / 920 = 0.004348
- intercept = 16 − 0.004348 × 360 = 14.435 px = 0.9022 rem (at 16 px per rem)
- CSS: `clamp(1rem, 0.9022rem + 0.4348vw, 1.25rem)`
- Check: at W = 800, F = 14.435 + 0.004348 × 800 = 17.913 px. At 360, 16 px; at 1280, 20 px.

Worked example, large heading: 28 px at 360 to 48 px at 1280.

- slope = 20 / 920 = 0.021739; intercept = 28 − 7.826 = 20.174 px = 1.2609 rem
- CSS: `clamp(1.75rem, 1.2609rem + 2.1739vw, 3rem)`
- Check: at 800, 37.565 px.

Assumptions and tests:
- The rem conversion assumes a 16 px root. If the user sets a larger default, the rem parts grow and the vw part does not; that is the intended behavior.
- `vw` alone does not respond to zoom. Test at 200% zoom that text actually grows (WCAG 1.4.4 Resize Text, AA, asks for text resizable to 200% without loss of content or function). A common heuristic: keep F_max / F_min at 2.5 or less so zoom keeps working; treat it as a check to run, not a guarantee.
- Test the endpoints, just inside them, and the longest real heading for awkward wrapping.

## 2. Spacing

- Pick a unit U and a small set of steps, for example U, 2U, 3U, 4U, 6U, 8U, 12U. A 4 or 8 px unit is convenient, not mandatory. Optical exceptions are allowed when written down.
- Three tiers: micro (inside a component: icon to label), component (between parts of a card or form), section (between page regions).
- **Proximity ratio.** G_groups / G_related, the gap between separate groups divided by the gap between related items. About 1.5 to 3 is a starting point. Example: label-to-input 8 px, field-to-field 24 px gives 24 / 8 = 3.
- **Padding fraction.** (top padding + bottom padding) / section height. Example: 96 + 96 on a 960 px section gives 192 / 960 = 0.20. Use it to flag sections that are mostly empty or cramped compared with their neighbours, not as a target.
- Keep external padding (a section's breathing room) separate from internal gaps (between its children). Give each spacing category a reason instead of one blanket rule.

## 3. Layout

### Container and columns

```
C       = min(W − 2G, C_max)            container width; G = outer gutter
column  = [C − (N − 1) × D] / N         N columns, D = gap between columns
N_max   = floor[(C + D) / (m + D)]      most columns that keep each at least m wide
```

Worked example: W = 1280, G = 32, C_max = 1200, D = 24.

- C = min(1280 − 64, 1200) = 1200
- 12 columns: (1200 − 11 × 24) / 12 = 78 px each
- 3 cards: (1200 − 48) / 3 = 384 px each; 4 cards: (1200 − 72) / 4 = 282 px each

### Unequal columns

For a ratio a : b with one gap D: first = a / (a + b) × (C − D), second = b / (a + b) × (C − D).

Worked example: 2 : 1, C = 1200, D = 48. First = 2/3 × 1152 = 768; second = 1/3 × 1152 = 384. Check: 768 + 384 + 48 = 1200.

### Alignment

- Inner text edge = outer edge + border + padding. A card at x = 120 with a 1 px border and 24 px padding puts its text at 145.
- Δx = the difference between two edges that look as if they should align. Report it in px and in units of U: a heading at x = 120 above that card text at 145 gives Δx = 25 px, about 3.1U at U = 8.
- Classify each Δx: **intentional** (an indent that signals structure), **accidental** (fix it), or **optical** (a round or pointed glyph pulled out so it looks aligned; usually a few px).

## 4. Breakpoints from content

### Navigation

```
required = logo + sum(link widths) + gaps between links + CTA + gaps between groups + side padding
```

Collapse to a compact menu before the available width drops below required + buffer.

Worked example (measured link widths): logo 140; links 64 + 72 + 88 + 60 + 80 = 364; 4 gaps × 32 = 128; CTA 136; 2 group gaps × 48 = 96; padding 2 × 24 = 48. Required = 140 + 364 + 128 + 136 + 96 + 48 = 912 px. With a 48 px buffer, collapse below 960 px.

Re-measure with longer translated labels and with text resized: link widths grow with text, so the real breakpoint moves. At 200% zoom a 1440 px window is 720 CSS px wide, so the compact menu must work too.

### Grids

Worked example: at W = 768 with G = 24, C = 720. Cards need at least m = 260 px to hold their content.

- 3 columns: (720 − 48) / 3 = 224 px, below 260, so the equation fails.
- N_max = floor[(720 + 24) / (260 + 24)] = floor(2.62) = 2; 2 columns: (720 − 24) / 2 = 348 px.

Reduce columns when the equation fails. Never shrink text below its readable range to keep a column count.

## 5. Contrast (WCAG requirement)

Relative luminance, per WCAG 2.2, for an sRGB colour with 8-bit channels:

```
c      = channel / 255
c_lin  = c / 12.92                       if c ≤ 0.04045
c_lin  = ((c + 0.055) / 1.055) ^ 2.4     otherwise
L      = 0.2126 R_lin + 0.7152 G_lin + 0.0722 B_lin
ratio  = (L1 + 0.05) / (L2 + 0.05)       L1 the lighter, L2 the darker
```

Thresholds (WCAG 2.2): 1.4.3 Contrast (Minimum), AA: 4.5:1 for text, 3:1 for large text. Large text is at least 18 pt or 14 pt bold, which is about 24 CSS px, or about 18.7 CSS px bold. 1.4.6 Contrast (Enhanced), AAA: 7:1 and 4.5:1. 1.4.11 Non-text Contrast, AA: 3:1 for parts of controls and graphics needed to identify them or their state.

Worked examples on white (#ffffff, L = 1):

| Foreground | L | Ratio | 4.5:1 text | 3:1 large or non-text |
| --- | --- | --- | --- | --- |
| #595959 | 0.0999 | 7.005 | pass | pass |
| #767676 | 0.18116 | 4.542 | pass | pass |
| #8a8a8a | 0.25415 | 3.452 | fail | pass |
| #949494 | 0.29614 | 3.033 | fail | pass |

Example for #767676: L = 0.18116, ratio = (1 + 0.05) / (0.18116 + 0.05) = 1.05 / 0.23116 = 4.542.

Check the real background: gradients at their lightest point under the text, semi-transparent layers composited onto what is beneath, images at the worst region behind the text, and every frame of an animation. Report the worst case.

## 6. Motion

### Sine drift

```
x(t) = x₀ + A × sin(2πt / P + φ)
```

A is the amplitude (px), P the period (s), φ the phase. Peak speed is 2πA / P.

Worked example: A = 6 px, P = 8 s, φ = 0. At t = 1 s, x − x₀ = 6 × sin(π/4) = 4.243 px; at t = 2 s, 6 px; at t = 4 s, 0. Peak speed = 2π × 6 / 8 = 4.712 px/s.

Phase is a narrative choice. A shared φ makes elements move as one; spreading φ (for three elements: 0, 2π/3, 4π/3, giving offsets 0, 5.196 and −5.196 px at t = 0) makes them drift independently. Neither is correct by default; say which story you want.

### Fading near text with smoothstep

Keep a protected reading region around text. Let d be the distance from that region's edge, with the effect fully suppressed inside d₀ and at full strength beyond d₁:

```
u    = clamp((d − d₀) / (d₁ − d₀), 0, 1)
s(u) = 3u² − 2u³
opacity = o_min + (o_max − o_min) × s(u)
```

Smoothstep starts and ends with zero slope, so there is no visible edge where the fade begins. The same s(u) can scale amplitude or particle density.

Worked example: d₀ = 80, d₁ = 240, o_min = 0.1, o_max = 0.6.

| d (px) | u | s(u) | opacity |
| --- | --- | --- | --- |
| 80 or less | 0 | 0 | 0.1 |
| 120 | 0.25 | 0.15625 | 0.178 |
| 160 | 0.5 | 0.5 | 0.35 |
| 200 | 0.75 | 0.84375 | 0.522 |
| 240 or more | 1 | 1 | 0.6 |

### Motion checks

- State duration, delay, amplitude, peak speed, opacity range, phase and reduced-motion behavior for each animation.
- Check the worst-case frame for contrast and overlap with text.
- Content must make sense with motion off. Honour `prefers-reduced-motion`; pause animation that is offscreen.
- WCAG 2.2.2 Pause, Stop, Hide (A): moving content that starts automatically, lasts more than 5 seconds and sits alongside other content needs a way to pause, stop or hide it, unless the motion is essential. WCAG 2.3.3 Animation from Interactions (AAA): motion triggered by interaction can be disabled unless essential.
