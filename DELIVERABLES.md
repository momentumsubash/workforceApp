# WorkForcePro — Deliverables Checklist

## Part 1: Backend (Express + SQLite)

| Deliverable | Status |
|-------------|--------|
| Employee CRUD API | ✅ |
| Training assignment/complete/approve API | ✅ |
| Certification CRUD + expiring endpoint | ✅ |
| Database schema (4 tables + departments) | ✅ |
| Intentional bugs injected | ✅ |

## Part 2: Frontend (React)

| Deliverable | Status |
|-------------|--------|
| Login page with role-based demo buttons | ✅ |
| Dashboard with stats cards | ✅ |
| Employee management page | ✅ |
| Training management page | ✅ |
| Certification management page | ✅ |
| Reports page | ✅ |
| Role-based routing (supervisor vs employee) | ✅ |
| `data-cy` attributes on all interactive elements | ✅ |

## Part 3: Test Artifacts

| Deliverable | File | Status |
|-------------|------|--------|
| Test Plan | `test-artifacts/01-test-plan.md` | ✅ |
| UI Test Cases | `test-artifacts/02-test-cases-ui.md` | ✅ |
| API Test Cases | `test-artifacts/02-test-cases-api.md` | ✅ |
| Execution Log | `test-artifacts/03-test-execution-log.md` | ✅ |
| Defect Reports | `test-artifacts/04-defect-reports.md` | ✅ |
| Test Summary Report | `test-artifacts/05-test-summary-report.md` | ✅ |
| Bug Tracking Matrix | `test-artifacts/06-bug-tracking-matrix.md` | ✅ |
| Submission Checklist | `test-artifacts/07-submission-checklist.md` | ✅ |

## Part 4: SQL Queries

| Deliverable | Status |
|-------------|--------|
| All employees with departments | ✅ |
| Employees with completed trainings | ✅ |
| Training count per employee | ✅ |
| Certifications expiring within 30 days | ✅ |
| Overdue trainings | ✅ |
| Top 5 by completed trainings | ✅ |
| File: `workforcepro-queries.sql` | ✅ |

## Part 5: Cypress Automation

| Deliverable | Status |
|-------------|--------|
| Page Object Model | ✅ |
| Reusable custom commands | ✅ |
| Dashboard tests (mocked API) | ✅ |
| Employee tests (real API) | ✅ |
| Training tests (real + mocked) | ✅ |
| Certification tests (mocked API) | ✅ |
| Mochawesome HTML report | ✅ |
| Code coverage report | ✅ |
| Videos and screenshots | ✅ |

## Part 6: Accessibility Report

| Deliverable | Status |
|-------------|--------|
| SauceDemo login page analysis | ✅ |
| SauceDemo product page analysis | ✅ |
| 7 issues identified (4 high, 3 medium) | ✅ |
| File: `saucedemo-accessibility-report.md` | ✅ |

## Part 7: Submission

| Deliverable | Status |
|-------------|--------|
| README — Backend | `backend/README.md` |
| README — Frontend | `frontend/README.md` |
| README — Cypress Automation | `cypress-automation/README.md` |
| README — Test Artifacts | `test-artifacts/README.md` |
| This checklist | `DELIVERABLES.md` |

## Project Structure

```
D:\tms\
├── workforceApp/
│   ├── backend/               ← Express + SQLite API
│   ├── frontend/              ← React UI
│   ├── test-artifacts/        ← Test documentation
│   ├── workforcepro-queries.sql
│   ├── saucedemo-accessibility-report.md
│   ├── WorkForcePro-API-Collection.json
│   └── Take Home Assignment - Software QA Engineer.docx
├── cypress-automation/        ← Cypress E2E tests
├── Subash_Acharya_CV.pdf
└── progress.md
```
