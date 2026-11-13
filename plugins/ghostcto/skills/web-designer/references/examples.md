# Worked examples

**Illustrative only.** The three sites below are fictional. Every "measured" value is invented to show the method; none comes from a real site. The arithmetic was checked by computing it. The point is the same principles applied to three different identities, not three house styles to copy.

## 1. Professional-services site (fictional accounting firm)

**Goal and identity.** Visitors are small-business owners deciding whether to book a call. The firm wants to look calm and established. Keep its serif logo and dark green; no new fonts.

**Baseline (invented, computed styles at 1440 × 900, zoom 100%).**

| Element | Measured value |
| --- | --- |
| Body | 15 px, line height 1.4 (L = 1.4) |
| Body text width | 900 px |
| Secondary text colour | #8a8a8a on #ffffff |
| Heading h2 | 32 px (R = 32 / 15 = 2.13) |
| Contact button | 40 px tall |

**Diagnosis.**

- Measure: 900 px ÷ (15 × 0.5 em average character, an assumption) ≈ 120 characters per line, well past the 45 to 75 starting range. Count real lines to confirm.
- Contrast: #8a8a8a on white is 3.452:1, which fails WCAG 1.4.3 (4.5:1) for normal text.
- Hierarchy: a ratio of 2.13 between h2 and small body text is loud for a calm brand.

**Changes.**

| Element | Measured value | Proposed value | Relationship or ratio | Reason | Verification |
| --- | --- | --- | --- | --- | --- |
| Body size | 15 px | `clamp(1rem, 0.9511rem + 0.2174vw, 1.125rem)` | 16 px at 360 to 18 px at 1280 | Reading comfort for long service descriptions | Re-measure at 360, 800, 1280 and 200% zoom |
| Body line height | 1.4 | 1.55 | Starting range 1.45 to 1.65 | Longer lines of text need air | Computed style |
| Reading width | 900 px | 640 px container | 640 ÷ 9 px ≈ 71 characters at 18 px | Bring measure into range | Count characters on real lines |
| Secondary text | #8a8a8a (3.452:1) | #595959 (7.005:1) | Passes 4.5:1 | WCAG 1.4.3 requirement | Recalculate on the real background |
| h2 | 32 px | 22.5 px at 18 px body | R = 1.25, restrained | Calm hierarchy; weight and space do the rest | Visual check of section order |

Fluid body arithmetic: slope = (18 − 16) / (1280 − 360) = 0.002174; intercept = 16 − 0.002174 × 360 = 15.217 px = 0.9511 rem.

**Hypothesis, not a finding.** Placing the firm's real professional registrations next to the booking button may reduce hesitation. Outcome to measure: booking-form submissions per visit, compared over the same season. Use only registrations the firm actually holds.

## 2. Software-product site (fictional project-tracking tool)

**Goal and identity.** Visitors compare tools and want to see the product. The brand is bright and energetic, with an animated gradient behind the hero. Keep both.

**Baseline (invented, computed styles at several widths).**

| Element | Measured value |
| --- | --- |
| Navigation | Logo 120; links 70, 84, 66, 92; link gaps 28; sign-in 72 + 16 gap + start button 128; group gaps 40; padding 20 each side |
| Feature grid | 3 columns at every width above 768, gap 24, outer gutter 32 |
| Feature card minimum content width | 280 px (longest heading plus icon) |
| Icon buttons in the header | 16 × 16 px, 4 px apart |
| Hero background | Particles drift behind the headline at full opacity |

**Diagnosis.**

- Navigation required width = 120 + (70 + 84 + 66 + 92) + 3 × 28 + (72 + 16 + 128) + 2 × 40 + 2 × 20 = 120 + 312 + 84 + 216 + 80 + 40 = 852 px. The menu currently collapses at 768, so links overlap between 768 and 852. Collapse below 900 (852 plus a 48 px buffer).
- Grid at W = 900: C = 900 − 64 = 836; 3 columns = (836 − 48) / 3 = 262.7 px, below the 280 px minimum. N_max = floor[(836 + 24) / (280 + 24)] = floor(2.83) = 2, giving 406 px cards. At W = 1024, C = 960 and 3 columns are 304 px, which fits. Switch from 2 to 3 columns where (C − 48) / 3 reaches 280, that is C = 888, W = 952.
- Icon buttons: 16 × 16 px is below 24 × 24 (WCAG 2.5.8). The spacing exception does not apply: centres are 16 + 4 = 20 px apart, so 24 px circles centred on neighbouring targets (radius 12, 24 px between centres needed) intersect. Enlarge the hit area to at least 24 × 24; the drawn icon can stay 16 px.
- Hero motion: particles pass behind the headline. Fade them near the text with smoothstep: protected distance d₀ = 80 px, full strength from d₁ = 240 px, opacity 0.1 to 0.6. At 160 px from the text, opacity = 0.1 + 0.5 × 0.5 = 0.35. Check headline contrast on the worst frame. Under `prefers-reduced-motion`, show a still frame. The drift runs longer than 5 seconds next to other content, so it needs a pause control (WCAG 2.2.2).

**Hypothesis, not a finding.** A product screenshot in place of the abstract hero illustration may help visitors understand the tool faster. Outcome to measure: clicks on "Start free" from the home page, and scroll depth to the pricing section.

## 3. Editorial site (fictional long-form magazine)

**Goal and identity.** Readers come for long articles. The magazine's identity is its serif typeface and dramatic headlines. Keep both; reading comfort comes first.

**Baseline (invented, computed styles at 1280 × 800).**

| Element | Measured value |
| --- | --- |
| Body | 19 px serif, line height 1.6 |
| Article text column | 680 px |
| Article plus sidebar | 3 : 1 split, container 1120, gap 64 |
| Headlines | Five different sizes across the article template |

**Diagnosis.**

- Measure: assuming an average character of 0.47 em for this serif (measure the real font), 19 × 0.47 = 8.93 px per character; 680 ÷ 8.93 ≈ 76 characters, just above the range. A 620 px column gives about 69.
- Columns: article = 3/4 × (1120 − 64) = 792 px; sidebar = 1/4 × 1056 = 264 px; 792 + 264 + 64 = 1120. Keep the 792 px column for images and pull quotes, and constrain the text inside it to 620 px.
- Hierarchy: the brand wants drama, so use an expressive modular scale with r = 1.333 on B = 19: 19, 25.327, 33.761, 45.003 px. Five headline sizes reduce to three steps (n = 1, 2, 3), rounded to 25, 34 and 45 px.
- Text spacing: apply the WCAG 1.4.12 overrides (line height 1.5, paragraph spacing 2 em, letter spacing 0.12 em, word spacing 0.16 em). Drop caps and pull quotes with fixed heights clip; switch them to heights that grow with their content.
- Reflow: at 320 CSS px the sidebar moves below the article, and wide data tables scroll horizontally on their own, which WCAG 1.4.10 allows for content that needs two dimensions.

**Project decision to record.** The 45 px top step and the 620 px reading width go into the project design config, so the next change starts from them rather than from this example.
