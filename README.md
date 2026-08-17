# STTPK3023 — Software Testing with Playwright

Coursework for **STTPK3023 (Software Testing)**. 

This repository contains automated end-to-end tests written with [Playwright](https://playwright.dev/) against an open-source PHP **School Management System (SMS)**, along with the accompanying test plan, test results, and supporting documentation.

The testing covers two areas:

1. **Functional requirement testing** — validating that key user flows (admin password change, admin profile edit, teacher leave application) behave according to their functional requirements.
2. **Reliability testing** — running a critical flow (admin editing a student's details) repeatedly to check for stability, with video capture and an auto-generated PDF report.

---

## Repository Structure

| Path | Description |
|------|-------------|
| `school-management-system/` | The PHP/MySQL application under test (open-source SMS). |
| `project-functionalreq/` | Playwright functional-requirement test specs. |
| `asg2-playwright-reliabilitytest/` | Playwright reliability test (20 iterations + PDF report + videos). |
| `software testing screenshots/` | Evidence screenshots captured during testing. |
| `STTPK3023_Software Test Plan.pdf` | The formal test plan document. |
| `STTPK3023_Software Test Result.pdf` | The compiled test result document. |
| `STTPK3023_299403_INDIVIDUALASG.pdf` | Individual assignment write-up. |

---

## Test Coverage

### Functional Requirement Tests (`project-functionalreq/tests/`)

| Spec file | Test cases |
|-----------|------------|
| `adminPasswordvalidation.spec.js` | Change password successfully, Change password with mismatched confirmation, Old password rejected after change |
| `adminProfilevalidation.spec.js` | Edit profile with valid details, Edit profile with empty required fields, Edit profile with invalid phone number |
| `teacherLeavevalidation.spec.js` | Apply for a new leave successfully, Validation errors for empty fields |

### Reliability Test (`asg2-playwright-reliabilitytest/`)

| Spec file | What it does |
|-----------|--------------|
| `reliability.spec.js` | Runs the "Admin edits a student's details" flow for **20 iterations**, records video for the first 5, and writes a summary to `reliability_report.pdf`. |
| `login.spec.js` | Smoke check that the SMS homepage loads. |

---

## Prerequisites

- **[Node.js](https://nodejs.org/)** (v18+ recommended) and npm
- A local PHP + MySQL server (e.g. **[XAMPP](https://www.apachefriends.org/)**) serving the SMS app at:
  ```
  http://localhost/school-management-system/
  ```
- The SMS database imported into MySQL (see `school-management-system/database/`)

**Default admin login** used by the tests:

| Field | Value |
|-------|-------|
| Email | `admin@gmail.com` |
| Password | `123` |

> A teacher account (`teacher@gmail.com` / `123`) is used by the leave test.

---

## Getting Started

### 1. Set up the application under test

1. Copy `school-management-system/` into your web server root (e.g. `C:\xampp\htdocs\`).
2. Start Apache and MySQL.
3. Import the SQL file from `school-management-system/database/` into MySQL.
4. Confirm the app loads at `http://localhost/school-management-system/`.

### 2. Run the functional requirement tests

```bash
cd project-functionalreq
npm install
npx playwright test
```

### 3. Run the reliability test

```bash
cd asg2-playwright-reliabilitytest
npm install
npx playwright test reliability.spec.js
```

This produces:
- `reliability_report.pdf` — a per-iteration pass/fail report
- `videos/` — recordings of the first 5 iterations
- `playwright-report/` — the standard Playwright HTML report

### View the HTML report

```bash
npx playwright show-report
```

---

## Configuration Notes

- Reliability test config (`asg2-playwright-reliabilitytest/playwright.config.js`) runs in **headed mode** with `slowMo` so the runs are visible on screen.
- The SMS test config (`school-management-system/playwright.config.js`) enables `video`, `screenshot`, and `trace` for every run.
- Base URL for the app is hard-coded to `http://localhost/school-management-system` in the specs — update it if you serve the app elsewhere.

---

## Test Results Summary

| ID | Module | Scenario | Type | Expected result |
|----|--------|----------|------|-----------------|
| TC-PW-01 | Admin – Password | Change password with valid current + matching new | Positive | Password updated, success toast shown |
| TC-PW-02 | Admin – Password | New / confirm password mismatch | Negative | Change rejected, error shown |
| TC-PW-03 | Admin – Password | Login with old password after change | Negative | Old password no longer accepted |
| TC-PR-01 | Admin – Profile | Edit profile with valid details | Positive | Profile saved after confirmation |
| TC-PR-02 | Admin – Profile | Submit with empty required fields | Negative | Validation blocks submit |
| TC-PR-03 | Admin – Profile | Enter invalid phone number | Negative | Validation blocks submit |
| TC-LV-01 | Teacher – Leave | Apply leave with valid details | Positive | Leave created and listed |
| TC-LV-02 | Teacher – Leave | Submit leave with empty fields | Negative | Validation errors shown |
| DC-001 | Teacher – Leave | Apply two leaves on the same day | Defect | Edge case captured during testing |
| DC-002 | Teacher – Leave | Apply duplicated leave entries | Defect | Edge case captured during testing |

> `DC-001` and `DC-002` are defect cases documented from exploratory testing (see the screenshots and the Test Result PDF for details).

---

## Screenshots

**Admin – Change Password** (`sms_5`)

| Valid change | Mismatched password |
|---|---|
| ![valid password change](software%20testing%20screenshots/sms_5/valid.png) | ![mismatched password](software%20testing%20screenshots/sms_5/tak%20sama%20password.png) |

**Admin – Edit Profile** (`sms_4`)

| Valid info | Confirmation | Invalid input |
|---|---|---|
| ![valid profile](software%20testing%20screenshots/sms_4/01-valid%20info.png) | ![confirm](software%20testing%20screenshots/sms_4/01-confirm.png) | ![invalid](software%20testing%20screenshots/sms_4/invalid%20all.png) |

**Teacher – Leave** (`sms_6`)

| Valid leave | Invalid leave | Edit leave | Delete leave |
|---|---|---|---|
| ![valid leave](software%20testing%20screenshots/sms_6/01-leave%20%28valid%29.png) | ![invalid leave](software%20testing%20screenshots/sms_6/02-leave%20%28invalid%29.png) | ![edit leave](software%20testing%20screenshots/sms_6/06-edit%20leave.png) | ![delete leave](software%20testing%20screenshots/sms_6/08-delete%20leave.png) |

**Defect Cases**

| Same-day leave (DC-001) | Duplicated leave (DC-002) |
|---|---|
| ![same day leave](software%20testing%20screenshots/dc001/same%20day%20leave.png) | ![duplicated leave](software%20testing%20screenshots/dc002/duplicated%20leave%20%281%29.png) |

---

## Documentation

The PDF documents in the repository root capture the formal deliverables: the **test plan**, the **test results**, and the **individual assignment report**.

---

