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

### 2.4.7 / 2.4.11 — Focus Visible & Focus Not Obscured

When moving between stepper cards, focus must land somewhere visible and not be hidden behind a sticky header/footer.

**Bad**

```jsx
function goToNextStep() {
  setStep(step + 1);
  // focus stays on the old "Next" button, which unmounts —
  // focus is lost to <body>, screen reader users lose their place
}
```

**Good**

```jsx
function goToNextStep() {
  setStep(step + 1);
}

useEffect(() => {
  // move focus to the new card's heading whenever the step changes
  cardHeadingRef.current?.focus();
}, [step]);

<h2 tabIndex={-1} ref={cardHeadingRef}>
  {stepTitle}
</h2>;
```

Also ensure `:focus-visible` outlines aren't hidden behind a sticky progress bar (`scroll-margin-top` or offset scroll helps).

---

## 2.4.3 — Focus Order

Focus order in each card should match the visual/logical reading order — critical once cards contain conditional fields.

**Bad**

```jsx
<div style={{ display: "flex", flexDirection: "row-reverse" }}>
  <input tabIndex={2} /> {/* visually first */}
  <input tabIndex={1} /> {/* visually second */}
</div>
```

**Good**

```jsx
// Let source order = visual order; use CSS (order/flex-direction) sparingly,
// and never fight it with manual tabIndex values.
<div className="row">
  <input name="firstName" />
  <input name="lastName" />
</div>
```

---

## 2.5.8 — Target Size (Minimum)

Stepper controls (Next/Back/dots) need at least a 24×24 CSS px hit area (or sufficient spacing).

**Bad**

```jsx
<button style={{ width: 16, height: 16, padding: 0 }} onClick={next}>
  ›
</button>
```

**Good**

```jsx
<button className="step-nav" onClick={next} aria-label="Next step">
  ›
</button>
```

```css
.step-nav {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 2.5.7 — Dragging Movements

If the stepper progress uses a draggable slider/timeline, provide a non-drag alternative.

**Bad**

```jsx
<Slider onDrag={handleStepDrag} /> {/* drag is the only way to jump steps */}
```

**Good**

```jsx
<Slider onDrag={handleStepDrag} />
<div role="group" aria-label="Jump to step">
  {steps.map((s, i) => (
    <button key={i} onClick={() => goToStep(i)} aria-current={i === step}>
      {i + 1}
    </button>
  ))}
</div>
```

---

## 4.1.2 — Name, Role, Value (custom stepper widget)

If the step indicator is a custom component (not native radio/tabs), it needs the right ARIA.

**Bad**

```jsx
<div className="stepper">
  {steps.map((s, i) => (
    <div
      key={i}
      className={i === step ? "active" : ""}
      onClick={() => goToStep(i)}
    >
      {s.label}
    </div>
  ))}
</div>
```

**Good**

```jsx
<div role="tablist" aria-label="Intake progress">
  {steps.map((s, i) => (
    <button
      key={i}
      role="tab"
      aria-selected={i === step}
      aria-controls={`panel-${i}`}
      id={`tab-${i}`}
      onClick={() => goToStep(i)}
    >
      {s.label}
    </button>
  ))}
</div>
<div role="tabpanel" id={`panel-${step}`} aria-labelledby={`tab-${step}`}>
  {/* current card content */}
</div>
```

---

## 3.3.2 / 1.3.1 — Labels & Programmatic Structure

Every intake field needs a real, associated `<label>` — placeholder text is not a label.

**Bad**

```jsx
<input placeholder="Full name" onChange={handleChange} />
```

**Good**

```jsx
<label htmlFor="fullName">Full name</label>
<input id="fullName" name="fullName" onChange={handleChange} />
```

---

## 3.3.1 / 3.3.3 — Error Identification & Suggestion

Validation errors on an intake card must be announced and programmatically tied to the field.

**Bad**

```jsx
{
  errors.email && <span className="error-text">Invalid</span>;
}
<input name="email" />;
```

**Good**

```jsx
<label htmlFor="email">Email</label>
<input
  id="email"
  name="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">
    Enter an email address in the form name@example.com
  </span>
)}
```

---

## 3.3.7 — Redundant Entry

Don't make the user re-enter info already captured on an earlier card (e.g., name given on Card 1, asked again on the Summary card).

**Bad**

```jsx
// Summary step re-asks for name instead of reusing it
<input name="confirmName" placeholder="Re-enter your name" />
```

**Good**

```jsx
// Summary step displays and allows editing previously entered data,
// pulled from shared form state — never re-collects it blind
<dl>
  <dt>Name</dt>
  <dd>
    {formState.fullName} <button onClick={() => goToStep(0)}>Edit</button>
  </dd>
</dl>
```

---

## 3.3.4 — Error Prevention (for data-altering / report-generating steps)

Generating a report is a meaningful action — let the user review and confirm before it's final, and allow correction after.

**Bad**

```jsx
<button onClick={generateReportImmediately}>Continue</button>
```

**Good**

```jsx
<button onClick={() => setStep("summary")}>Review before generating</button>
// Summary card shows all entered data with Edit links per section,
// plus an explicit "Generate report" confirmation button
```

---

## 3.3.8 — Accessible Authentication (Minimum)

Login for viewing saved reports must not require a cognitive function test (e.g., manually transcribing a CAPTCHA image, or solving a puzzle) with no alternative.

**Bad**

```jsx
<img src="/captcha.png" alt="" />
<input placeholder="Type the characters above" />
```

**Good**

```jsx
// Password managers/autofill supported, and either no CAPTCHA
// or an accessible alternative (e.g. audio CAPTCHA, or a
// "prove you're not a bot" method that doesn't rely on transcription)
<input type="password" name="password" autoComplete="current-password" />
```

---

## 4.1.3 — Status Messages

Report generation is often asynchronous — the loading/success/error state must be announced to screen reader users without moving focus unexpectedly.

**Bad**

```jsx
{
  isGenerating && <p>Generating report...</p>;
}
{
  /* no aria-live — screen reader users get no announcement at all */
}
```

**Good**

```jsx
<div aria-live="polite" role="status">
  {isGenerating && "Generating your report…"}
  {reportReady && "Report ready. Scroll down to view it."}
  {error && "There was a problem generating your report."}
</div>
```

---

## 1.4.11 — Non-text Contrast

Stepper progress indicators (dots, progress bar fill, icon-only buttons) need 3:1 contrast against their background — not just text.

**Bad**

```css
.step-dot.active {
  background: #cfe8ff;
} /* on a white background: ~1.3:1 */
```

**Good**

```css
.step-dot.active {
  background: #0057b8;
} /* ~5.2:1 against white */
```

---

## Quick reference table

| SC             | Name                              | Where it bites in this app         |
| -------------- | --------------------------------- | ---------------------------------- |
| 2.4.7 / 2.4.11 | Focus Visible / Not Obscured      | Focus management on step change    |
| 2.4.3          | Focus Order                       | Conditional fields inside cards    |
| 2.5.8          | Target Size (Minimum)             | Next/Back/dot controls             |
| 2.5.7          | Dragging Movements                | Draggable progress/timeline UI     |
| 4.1.2          | Name, Role, Value                 | Custom stepper widget              |
| 1.3.1 / 3.3.2  | Info & Relationships / Labels     | Intake form fields                 |
| 3.3.1 / 3.3.3  | Error Identification / Suggestion | Field validation                   |
| 3.3.7          | Redundant Entry                   | Summary step reusing prior answers |
| 3.3.4          | Error Prevention                  | Confirm-before-generate flow       |
| 3.3.8          | Accessible Authentication         | Login for saved reports            |
| 4.1.3          | Status Messages                   | Async report generation            |
| 1.4.11         | Non-text Contrast                 | Progress indicators, icon buttons  |
