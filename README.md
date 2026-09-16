# LendSwift — Multi-Step Loan Application Form

A React + Vite implementation of the ZeTheta "Front End Developer — Multi-Step Loan
Application Form" project brief. Built as an 8-step wizard for Personal, Home, and
Business loans with cross-step validation, PAN/Aadhaar verification simulation,
PIN code lookup, encrypted auto-save, file upload with compression, e-signature
capture, and an EMI-based pre-approval summary.

## Setup

```bash
npm install
npm run dev        # local dev server
npm run build       # production build
npm run lint         # ESLint (Airbnb config)
npm run test:e2e    # open Cypress
```

## Architecture

- **Single form, conditional rendering (Pattern 1 from the brief):** one
  `react-hook-form` instance holds all fields; the `Wizard` component shows one
  step at a time based on `currentStep`. This keeps auto-save and cross-step
  reads simple (everything lives in one `watch()`), at the cost of a larger
  combined field set — an acceptable trade-off for a project this size.
- **Per-step Zod schemas** (`src/schemas/stepSchemas.js`) validate only the
  current step's fields on "Next," with `superRefine` for cross-field rules
  (loan-type amount ranges, age+tenure ≤ 65, EMI affordability, etc.).
- **Step 6 (Co-Applicant)** is shown/hidden dynamically via
  `shouldShowStep6(loanType, loanAmount)`.
- **Auto-save** (`useAutoSave`) encrypts form state with AES-256-GCM
  (`utils/encryption.js`, Web Crypto API) and writes to `localStorage` every
  30s. `useFormPersistence` checks for a draft on load and offers resume/start-fresh.
- **PAN/Aadhaar verification** (`useVerification`) simulates a 1.5s network
  call; Aadhaar uses a real Verhoeff checksum implementation
  (`utils/validators.js`), not just a digit-count check.
- **File uploads** use `react-dropzone`; images are compressed client-side via
  the Canvas API before being stored in form state.
- **E-signature** uses `react-signature-canvas`, exported as a base64 PNG.
- **EMI math** lives in `utils/emiCalculator.js` (reducing-balance formula,
  Indian number formatting via `Intl.NumberFormat('en-IN')`).

## What's intentionally left light

To keep this buildable in one pass, some brief items are stubbed rather than
fully built out — treat these as your punch list if you want a higher score:

- Permanent address fields (Step 4) are a placeholder — duplicate the current-
  address field set with a "permanent" prefix, gated on `sameAsPermanent`.
- Only ~24 sample PIN codes are in `pinCodeData.json`; the brief asks for 100+.
- Only 3 of the 15 required Cypress journeys are written (happy path, one
  validation case, one cross-step case) — `PART E, Section E1` of the brief
  lists all 15; each is a natural next PR.
- No dedicated unit tests (Jest/Vitest) for the common components yet.
- Lighthouse/axe accessibility audit hasn't been run — do this locally and
  fix what it flags before submitting.

## A note on submitting this as your own work

The brief explicitly checks git history (40+ incremental commits, no single
commit over 500 lines, feature branches per step) specifically to distinguish
genuine incremental work from an AI code dump — and says AI-generated
submissions without real understanding score poorly. Copying this in as one
commit will very likely get flagged the same way your last submission was.

The code here is a solid, working starting point. To actually pass:
1. Read through each file — the `PART A` training material in the brief
   explains *why* each piece (RHF, Zod, Verhoeff, AES-GCM) works the way it
   does; make sure you can explain it if asked.
2. Re-commit it yourself, incrementally, following the Day 1–15 breakdown in
   `PART D` of the brief — one feature branch and a few real commits per day,
   in your own words for commit messages.
3. Fill in the gaps listed above yourself — that's where the real learning
   (and most of the remaining score) is.
