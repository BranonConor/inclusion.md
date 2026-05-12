# INCLUSION.md - Frontend Web App (example)

> Example adaptation for a consumer-facing frontend web application.
> Replace bracketed placeholders with values for your project.

This file extends the base [`INCLUSION.md`](../../INCLUSION.md) template with
guidance specific to a public, consumer-facing web app.

---

## 1. Project Context

- **Product:** [Short description of the web app and what users come here to do.]
- **Primary users:** [e.g. "US-based adults managing personal finances."]
- **Known underserved users:** [e.g. "Screen reader users on the dashboard;
  Spanish-language users in onboarding; users on Android Go devices."]
- **Distribution context:** Web. Modern evergreen browsers + last 2 versions
  of Safari/Firefox. Mobile web is [N]% of traffic. Top non-English language
  in analytics is [language]. Assistive tech in our analytics includes
  [VoiceOver, NVDA, JAWS, TalkBack, Dragon, Switch Control].
- **Stakes:** [e.g. "Users who cannot complete onboarding lose access to
  [service]. This is not a low-stakes flow."]

---

## 2. Frontend-Specific Engineering Guidance

In addition to the base `INCLUSION.md` Section 8, generated frontend code in
this repo should:

- Use semantic HTML elements (`<button>`, `<a>`, `<nav>`, `<main>`,
  `<section>`, `<label>`, `<input>`, `<dialog>` where supported). Never
  `div` + `onClick` for interactive controls.
- Manage focus on route changes, modal open/close, and async state
  transitions.
- Pair every icon-only button with an `aria-label` or visually hidden text.
- Use `aria-live` regions for important async updates (form errors, toast
  notifications, search results) and verify them with a screen reader before
  merging.
- Never rely on hover, color, or position alone to convey state.
- Support `prefers-reduced-motion` for all transitions and animations.
- Default to system color scheme. Provide a manual override.
- Lazy-load images and below-the-fold media. Always provide meaningful `alt`
  text. Decorative imagery uses `alt=""`.
- Render text content server-side wherever possible to support assistive tech
  and slow networks.
- Test interactive components with keyboard alone before merging.

---

## 3. Copy & Microcopy

- Default reading level: US grade 7. Consent, onboarding, and error states:
  grade 6.
- Error messages should: (1) name the problem in plain language, (2) tell the
  user what to do next, (3) preserve their input. Never blame the user.
- Empty states should explain what the user can do, not just that there is
  nothing here.
- Avoid jokes, idioms, and US-cultural references in core flows. They do not
  localize.

---

## 4. Forms

Forms are where most exclusion happens.

- Every input has a visible, persistent `<label>`. Placeholder text is not a
  label.
- Required fields are explicitly marked. Optional fields are explicitly
  marked.
- Error messages are associated with their inputs via `aria-describedby`.
- Names: do not require a "first name" + "last name" split. Use a single
  full-name field. Allow Unicode, spaces, hyphens, apostrophes, and length up
  to at least 70 characters.
- Addresses: support international formats. Do not assume US ZIP, US states,
  or a single-line city/state/zip.
- Phone numbers: store E.164. Support country codes.
- Gender: if you must ask, provide a free-text option and "prefer not to
  say." Do not require it for transactional flows.
- Date of birth: do not require it unless legally necessary. Support
  full-range, not just current decade.
- Never auto-advance focus between inputs unless the user is filling a
  segmented code field.

---

## 5. Personalization & AI Features

If this app uses AI features (recommendations, summarization, generative
content, chat):

- Inform users when content is AI-generated.
- Provide a clear opt-out for AI personalization.
- Do not use AI features to gate access to core functionality.
- Surface confidence and uncertainty. Do not present probabilistic output as
  fact.
- Do not collect biometric, voice, or facial data without explicit,
  separately-toggled consent.
- Preserve user agency: users can edit, reject, or override any AI output.
