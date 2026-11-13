# Project design config template

Optional. Copy this into the project, for example as `docs/design-config.md` or inside an existing design document, and fill in what the project has decided. The skill stays brand-neutral; this file holds the project's own values. Leave a field as "not decided" rather than guessing, and record where each value came from.

Every value here is a **project decision**. Keep measured baselines and hypotheses out of this file, or label them.

```markdown
# Design config

Owner: <person or team who approves changes here>
Last reviewed: <date>

## Identity to keep
- Voice: <two or three words, with an example sentence>
- Brand assets that must not change without approval: <logo, typefaces, colours, illustration style>
- What the brand should never look like: <one line>

## Type roles
| Role | Family | Weight | Size (min to max) | Line height | Letter spacing | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| body | | | | | | |
| small | | | | | | |
| h1 | | | | | | |
| h2 | | | | | | |
| h3 | | | | | | |
| label / button | | | | | | |

Hierarchy strategy: <restrained, or modular scale with ratio r>
Fluid range: <W_min to W_max in CSS px>
Reading measure target: <characters per line>

## Spacing tokens
Unit U: <px>
Steps: <for example U, 2U, 3U, 4U, 6U, 8U, 12U, with token names>
Named exceptions: <value, where, and why>

## Containers and grid
| Container | Max width | Use |
| --- | --- | --- |
| reading | | long-form text |
| content | | general sections |
| wide | | media, grids |

Outer gutter by viewport: <values>
Columns and gap: <N, D>
Minimum card width: <px>

## Breakpoints
| Name | Width (CSS px) | What changes | Content reason |
| --- | --- | --- | --- |

## Colour roles
| Role | Value | Pairs with | Measured contrast |
| --- | --- | --- | --- |

## Motion
- Durations: <short, medium, long in ms>
- Easing: <curves>
- Reduced-motion behavior: <what stops, what remains>
- Ambient motion rules: <amplitude limit, protected text region>

## Exceptions
| Where | Rule broken | Reason | Approved by |
| --- | --- | --- | --- |

## Hosted platform (if any)
- Platform: <Webflow, WordPress, none>
- Who may approve publishing: <person>
- Where changes are staged: <staging domain or draft process>
```
