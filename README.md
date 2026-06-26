# WorkForcePro

Workforce Management & OJT Training Platform — a full-stack application with intentional bugs for QA assessment.

## Quick Start

### 1. Backend (API)

```bash
cd workforceApp/backend
npm install
npm start          # → localhost:3001
```

### 2. Frontend (UI)

```bash
cd workforceApp/frontend
npm install
npm start          # → localhost:3000
```

### 3. Run Cypress Tests

```bash
cd cypress-automation
npm install
npm run cypress:run
```

## Project Overview

```
workforceApp/
├── backend/              Express + SQLite REST API (port 3001)
├── frontend/             React UI (port 3000)
├── test-artifacts/       Test plans, cases, defect reports, summary
├── workforcepro-queries.sql          6 SQL queries with output
├── saucedemo-accessibility-report.md  Accessibility audit
├── DELIVERABLES.md                   Full deliverables checklist
├── WorkForcePro-API-Collection.json  Postman collection
└── Take Home Assignment - Software QA Engineer.docx

cypress-automation/       Cypress E2E tests (Page Object Model, mochawesome, coverage)
```

## Cypress Tests — Mock vs Real API

| Spec | Approach | Details |
|------|----------|---------|
| **Dashboard** | 🎭 Mocked | All API responses intercepted — tests verify UI renders controlled mock data (e.g., stat card shows exactly 2 employees) |
| **Employee** | 🎯 Real API | Creates, updates, deletes employees against the live backend at `localhost:3001`. Verifies data persists in the table |
| **Training** | 🎯 Real + 🎭 Mocked | Assign/complete/approve hit the real backend. DEF-002 (unassigned completion) and DEF-003 (self-approval) use mocked error responses |
| **Certification** | 🎭 Mocked | Add, delete, expiring checks all use intercepted responses. Error handling tested with mocked 500 responses |

## Cypress Reports

After running `npm run cypress:run`, all reports are generated inside `cypress-automation/reports/`:

```
cypress-automation/reports/
├── html/
│   └── workforcepro-test-report.html    ← Mochawesome HTML report (tests, pass/fail, duration)
├── coverage/
│   └── index.html                        ← Code coverage report (statements, branches, functions, lines)
├── screenshots/                          ← Auto-captured on test failure
└── videos/                               ← Recordings of full test runs
```

## Key Documents

| Document | Location |
|----------|----------|
| Deliverables Checklist | `DELIVERABLES.md` |
| Test Plan | `test-artifacts/01-test-plan.md` |
| Defect Reports | `test-artifacts/04-defect-reports.md` |
| Bug Tracking Matrix | `test-artifacts/06-bug-tracking-matrix.md` |
| Test Summary | `test-artifacts/05-test-summary-report.md` |
| SQL Queries | `workforcepro-queries.sql` |
| Accessibility Report | `saucedemo-accessibility-report.md` |
| Cypress README | `cypress-automation/README.md` |

## Demo Users

| Email | Role | Password |
|-------|------|----------|
| jane.smith@workforcepro.com | Supervisor | any |
| john.doe@workforcepro.com | Employee | any |

Or use the demo buttons on the login page.
