# INCLUSION.md - Backend API / SDK (example)

> Example adaptation for a backend API or SDK.

Backend systems are not exempt from inclusion considerations. Schema choices,
error messages, rate limits, language defaults, and data models ripple
outward into every UI and integration that consumes them.

This file extends the base [`INCLUSION.md`](../../INCLUSION.md) template.

---

## 1. Project Context

- **Product:** [API or SDK description.]
- **Primary consumers:** Internal teams and/or external developers.
- **End-user impact:** This API mediates [user data, authentication,
  payments, messaging, etc.] for downstream products. Exclusionary defaults
  here become exclusionary defaults everywhere.
- **Distribution context:** Used in [N] downstream products across [regions
  / locales / device classes].
- **Stakes:** Schema and validation choices made here are extremely difficult
  to roll back once published.

---

## 2. Schema & Data Model Guidance

Generated and hand-authored schemas in this repo should:

- **Names:** A single `full_name` string field (Unicode, up to 255
  characters, no validation against "first/last" splits). Optionally a
  separate `display_name` or `preferred_name`. If legal name is required
  separately for compliance, name the field `legal_name` and document why.
  See Patrick McKenzie, _Falsehoods Programmers Believe About Names_:
  <https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/>.
- **Email:** Validate per RFC 5321 + 5322. Do not enforce
  ASCII-only or single-`@` heuristics.
- **Phone:** Store E.164. Accept any digits and the international format on
  input.
- **Addresses:** Support multi-line, international addresses. Do not require
  US states or 5-digit ZIPs.
- **Gender / pronouns:** Optional, free-text, plus an enumerated suggestion
  list. Never required. Never used for access control.
- **Date of birth:** Stored as ISO 8601 date, no assumed minimum or maximum
  year. Do not collect unless legally required.
- **Time:** Always store UTC. Always expose timezone separately. Never
  assume the consumer's locale.
- **Language:** Every endpoint accepts `Accept-Language`. Every response
  includes a `Content-Language`. Default to the user's stated preference,
  not the server's locale.
- **Currency:** Store amounts as integer minor units (cents) + ISO 4217
  currency code. Never assume USD.
- **Units:** Expose units explicitly. Never assume imperial vs. metric.

---

## 3. Error Messages & API Surface

API error messages are user-facing more often than designers admit.

- Error messages must be plain language and translatable. Provide a stable
  `error_code` separate from the human-readable `message`.
- Never leak PII, secrets, or stack traces in error responses.
- Provide a `next_steps` or `documentation_url` field where helpful.
- Do not blame the caller for ambiguous input. "We couldn't find that
  account" is more usable than "INVALID_INPUT."
- Validation errors return per-field detail so downstream UIs can render
  accessible inline form errors.

---

## 4. Rate Limits, Quotas, and Accessibility

- Rate limits should not penalize assistive-technology-driven traffic
  patterns. Screen reader users often re-request pages, refocus, and
  re-trigger flows.
- Provide a `Retry-After` header and a documented exponential backoff
  strategy. Do not silently drop requests.
- For paginated endpoints, expose total counts and cursors. Infinite scroll
  without an end is hostile to screen reader and keyboard users.
- Do not use CAPTCHA as a primary anti-abuse strategy. Where CAPTCHA is
  unavoidable, support accessible alternatives.

---

## 5. Authentication & Identity

- Support more than one factor of authentication, and more than one type of
  second factor (TOTP, hardware key, SMS as last resort, email).
- Do not require SMS as the only second factor. SMS excludes users without
  reliable cell service, users abroad, and users with shared phones.
- Support account recovery flows that do not depend on a single device or
  carrier.
- Never lock users out of their own data because they have changed name,
  gender marker, address, or contact info.

---

## 6. Logging, Analytics, and Privacy

- Log levels: never log PII at INFO or above. Audit before adding fields.
- Do not log message bodies, names, addresses, or identifiers in plaintext
  to shared aggregators.
- Telemetry: opt-in for end-user-identifying telemetry. Opt-out is not
  consent.
- Anonymization is hard. Aggregate where possible. Hash with care.

---

## 7. SDK Documentation

- Code examples in SDK docs use realistic, internationally varied sample
  data - not "John Doe, 123 Main St, USA."
- Document defaults explicitly so consumers can override them per locale.
- Document accessibility implications of API choices (e.g. "this endpoint
  returns infinite-scroll cursors; consumers must provide an end-of-results
  cue for assistive tech").
