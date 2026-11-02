# Accessibility

## Summary

This application is built and tested to be usable by people with disabilities, including those who rely on screen readers or keyboard-only navigation.

- Targets **WCAG 2.2 Level AA**.
- Changes are automatically scanned for accessibility issues before they can be merged.
- Manually tested with assistive technology (screen readers and keyboard-only navigation) to catch what automated tools can't.

## Automated Testing

- **Tooling:** [`axe-core`](https://github.com/dequelabs/axe-core) via `jest-axe`.
- **Where it runs:** CI pipeline, on every pull request.
- **Enforcement:** blocking — a detected violation fails the CI check and prevents merge.
- **What it catches:** rule-based issues like missing alt text, insufficient color contrast, missing form labels, invalid ARIA usage, and improper heading structure.

## Manual & Assistive Technology Testing

- **Screen readers:** NVDA (Windows) and VoiceOver (macOS/iOS Safari).
- **Keyboard navigation:** tested alongside screen reader testing — tabbing through the full interface, checking focus order, visible focus indicators, and that all interactive elements are reachable and operable without a mouse.
- **Cadence:** during development of new features and before releases.

## Safeguards

| Safeguard                   | Description                                                   |
| --------------------------- | ------------------------------------------------------------- |
| CI-blocking automated scans | `axe-core`/`jest-axe` run on every PR; violations block merge |
| Manual AT testing           | NVDA + VoiceOver testing                                      |
| Keyboard testing            | Full keyboard-only pass, performed alongside AT testing       |
| WCAG 2.2 AA target          | Baseline standard for all UI decisions                        |

## WCAG 2.2 AA Checklist — Chart UI

### Perceivable

#### 1.1.1 — Non-text Content

Provide text alternatives for meaningful images and icons, and hide decorative
icons from assistive technology. Ensure the selected-location map has an
equivalent textual address and coordinate summary.

#### 1.3.1 — Info and Relationships

Ensure that form labels, grouped controls, section headings, and other visual
relationships are also represented programmatically.

#### 1.4.1 — Use of Colour

Do not use colour alone to distinguish selected, completed, locked, warning, or
error states. Provide another visual cue, such as text, shape, or an icon, and
expose control state programmatically where applicable.

#### 1.4.3 — Contrast (Minimum)

Maintain a contrast ratio of at least 4.5:1 for normal text and 3:1 for large
text, including muted labels and text in selected, unselected, disabled,
loading, and error states. Check both light and dark themes where the UI is
available.

#### 1.4.4 — Resize Text

At 200% text resizing, ensure users can still access all content and
functionality without clipping or overlap, including in the stepper and inventory
controls.

#### 1.4.10 — Reflow

At a viewport equivalent to 320px wide (including at 400% zoom), keep
intake fields, inventory choices, step navigation, and report content usable
without loss of information or functionality and without two-dimensional
scrolling, except where that layout is essential. Provide a textual location
summary so using the map is not required to understand the selected location.

#### 1.4.11 — Non-text Contrast

Ensure visual information needed to identify controls and their states has at
least 3:1 contrast against adjacent colors. Check control boundaries,
selection indicators, and keyboard focus indicators in the themes where the UI
is available.

#### 1.4.12 — Text Spacing

When users increase line, paragraph, letter, and word spacing to the WCAG
specified values, ensure intake labels and help text, category names, and
controls do not clip, overlap, or lose functionality.

#### 1.4.13 — Content on Hover or Focus

Inventory descriptions must be available when their control receives keyboard
focus, remain visible while the pointer moves over the description, and be
dismissible without moving focus or the pointer. Ensure touch users can access
the same description without relying on hover. Touch users currently have no
separate way to reveal inventory descriptions.

### Operable

#### 2.1.1 — Keyboard

All functionality must be operable using a keyboard, including changing
inventory categories, selecting systems and site features, using step
navigation, and opening or closing menus and dialogs. Users must not need to
operate the map to understand or use the selected location.

#### 2.4.1 — Bypass Blocks

Provide a keyboard-accessible way to bypass repeated header content and move
directly to the main area, such as a skip link.

#### 2.4.2 — Page Titled

Give each route a page title that identifies its purpose, and update the
document title when navigation occurs within the single-page app.

#### 2.4.3 — Focus Order

Keep keyboard focus order aligned with the visual and logical reading order,
including when card layouts reflow or reveal conditional fields.

#### 2.4.6 — Headings and Labels

Use headings that identify each intake section and card, and labels that
describe the purpose of each field and control, including category selectors
and report-review edit actions.

#### 2.4.7 / 2.4.11 — Focus Visible & Focus Not Obscured

When moving between stepper cards, focus must land somewhere visible and not be
hidden behind sticky content.

When focus moves to a card heading, ensure sticky content does not obscure it
or the visible focus indicator.

#### 2.5.8 — Target Size (Minimum)

Stepper and category controls must provide targets of at least 24×24 pixels
or meet one of the criterion's defined exceptions. Larger targets may improve
usability, especially on touch devices.

### Understandable

#### 3.3.1 — Error Identification

Identify intake validation errors in text and associate field-specific
messages with the relevant field.

#### 3.3.2 — Labels or Instructions

Provide labels or instructions for intake fields, including any required
information or input format users need to complete them.

#### 3.3.3 — Error Suggestion

When the correction is known, explain how to fix an identified input error.

#### 3.3.4 — Error Prevention (Data)

This criterion applies to actions that modify or delete user-controllable data.
For these actions, provide at least one safeguard: make the action reversible, check the submitted information and let the user correct it, or
provide a review and confirmation step. Deleting saved reports is an example
of a user-controllable data action; report generation alone does not trigger
this criterion.

#### 3.3.7 — Redundant Entry

Do not ask users to re-enter information they already provided in the flow.
Reuse that information or let users select it. Keep the report review's links
to edit intake, systems, and site features rather than collecting the same
information again.

#### 3.3.8 — Accessible Authentication (Minimum)

Chart UI delegates sign-in to Google or Microsoft.

### Robust

#### 4.1.2 — Name, Role, Value (category selectors)

The Systems and Site Features cards let users switch between categories. Ensure
each category control has an accessible name and its selected state is exposed
programmatically as well as visually. These controls can remain native buttons
with toggle state; use tab semantics only if implementing the full tabs
interaction pattern. The stepper is separate button navigation, not a tablist.

#### 4.1.3 — Status Messages

Announce asynchronous updates, including report generation, address search,
saved-report loading, and loading the building-systems and site-features
reference data.
