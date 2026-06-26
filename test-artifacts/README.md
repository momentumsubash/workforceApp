# WorkForcePro — Test Artifacts

Test plan, test cases, execution logs, defect reports, and submission checklist for the WorkForcePro platform.

## Files

| # | File | Description |
|---|------|-------------|
| 01 | `01-test-plan.md` | Master test plan — scope, strategy, requirements coverage, all test cases (UI + API) |
| 02 | `02-test-cases-ui.md` | UI test cases with step-by-step actions, expected vs actual results, screenshots |
| 03 | `02-test-cases-api.md` | API test cases with curl commands, expected responses, and execution results |
| 04 | `03-test-execution-log.md` | Execution log — which tests passed/failed, with screenshots and defect references |
| 05 | `04-defect-reports.md` | Detailed defect reports — steps to reproduce, impact, suggested fixes |
| 06 | `05-test-summary-report.md` | Combined summary — pass/fail counts, bug distribution, recommendations |
| 07 | `06-bug-tracking-matrix.md` | Bug tracking matrix — all 13 defects with severity, priority, and detailed write-ups |
| 08 | `07-submission-checklist.md` | Submission checklist — project readiness status |

## Test Coverage

| Module | Tests | Passed | Failed | N/A |
|--------|-------|--------|--------|-----|
| Employee Management | 6 | 5 | 1 | 0 |
| Training Management | 8 | 3 | 4 | 1 |
| Certification Management | 5 | 1 | 3 | 1 |
| Dashboard | 6 | 6 | 0 | 0 |
| Navigation & UI | 3 | 3 | 0 | 0 |
| Training List | 1 | 0 | 1 | 0 |
| End-to-End Workflows | 2 | 0 | 1 | 1 |
| **UI Total** | **31** | **18** | **10** | **3** |
| **API Total** | **5** | **0** | **5** | **0** |

## Defects Found

| Severity | Count | Defects |
|----------|-------|---------|
| Critical | 1 | DEF-002 |
| Security | 1 | DEF-003 |
| Major | 7 | DEF-005, DEF-007, DEF-008, DEF-010, DEF-011, DEF-012, DEF-013 |
| Medium | 1 | DEF-009 |
| Minor | 3 | DEF-001, DEF-004, DEF-006 |

## SQL Queries

See `workforcepro-queries.sql` for 6 SQL queries against the WorkForcePro database:

1. All employees with departments
2. Employees who completed all / at least one training
3. Training count per employee
4. Certifications expiring within 30 days
5. Employees with overdue trainings
6. Top 5 employees by completed trainings

## Key Findings

- **API pass rate: 0%** — all 5 API test cases failed due to intentional bugs
- **UI pass rate: 58%** — 18 of 31 UI tests passed
- **13 confirmed defects** — 8 backend bugs (confirmed via live API testing) + 5 UI bugs
- DEF-004 affects the expiring certifications endpoint (uses `< 30` instead of `<= 30`)
- DEF-007: training list page is a stub, does not render training modules
- No certification auto-creation on training approval (DEF-008, DEF-009, DEF-011)
