# WorkForcePro — Cypress Automation

End-to-end tests for the WorkForcePro application using Cypress with Page Object Model, Mochawesome reporting, and code coverage.

## Tech Stack

- **Framework:** Cypress 13
- **Pattern:** Page Object Model
- **Reporting:** Mochawesome (HTML) + NYC (code coverage)
- **Selectors:** `data-cy` attributes

## Project Structure

```
cypress-automation/
├── cypress.config.js              # Cypress configuration
├── .nycrc                         # Code coverage config
├── package.json
├── cypress/
│   ├── e2e/
│   │   ├── dashboard.spec.cy.js       # Mocked API — 10 tests
│   │   ├── employee.spec.cy.js        # Real API — 9 tests
│   │   ├── training.spec.cy.js        # Real + mocked — 9 tests
│   │   └── certification.spec.cy.js   # Mocked API — 11 tests
│   ├── fixtures/
│   │   ├── test-data.json
│   │   └── employee-trainings.json
│   └── support/
│       ├── commands.js            # Custom Cypress commands
│       ├── e2e.js                 # Support entry point
│       └── page-objects/
│           ├── BasePage.js
│           ├── LoginPage.js
│           ├── DashboardPage.js
│           ├── EmployeesPage.js
│           ├── TrainingsPage.js
│           └── CertificationsPage.js
```

## Test Approach

| Spec | Approach | Purpose |
|------|----------|---------|
| Dashboard | 🎭 Mocked API | Demonstrates testing with controlled data |
| Employee | 🎯 Real API | Demonstrates testing against live backend |
| Training | Mixed | Core flow uses real API; defect tests use mocks |
| Certification | 🎭 Mocked API | Demonstrates error handling and edge cases |

## Commands

```bash
# Open Cypress interactive runner
npm run cypress:open

# Run all tests headlessly
npm run cypress:run

# Run with browser visible
npm run cypress:run:headed

# Generate HTML report (auto-generated after run)
npm run report

# Generate coverage report
npm run coverage

# Clean all reports
npm run clean
```

## Page Objects

Each page has a dedicated class exposing methods for its interactions:

```js
// Login
loginPage.loginAs('email', 'password');
loginPage.loginViaDemo('supervisor', 1);

// Dashboard
dashboardPage.navigateTo('employees');
dashboardPage.logout();
dashboardPage.getStatCard('employees');

// Employees
employeesPage.openAddModal();
employeesPage.fillEmployeeForm({ employee_id, name, email });
employeesPage.submitModal();

// Trainings
trainingsPage.selectEmployee(13);
trainingsPage.assignTraining(trainingId, supervisorId);
trainingsPage.completeTraining(trainingId);

// Certifications
certificationsPage.openAddModal();
certificationsPage.fillCertModal({ employee, name, expiry });
certificationsPage.submitModal();
```

## Reports

After running tests, reports are generated at:

```
reports/
├── html/workforcepro-test-report.html   # Mochawesome HTML report
├── coverage/index.html                   # Code coverage report
├── screenshots/                          # Failure screenshots
└── videos/                               # Test recordings
```

## Custom Commands

| Command | Description |
|---------|-------------|
| `cy.loginAsSupervisor(index)` | Login via demo button (default: first supervisor) |
| `cy.loginAsEmployee(index)` | Login via demo button (default: first employee) |
| `cy.login(email, password)` | Login with credentials |
| `cy.logout()` | Logout via logout button |
| `cy.navigateTo(page)` | Click sidebar link |
| `cy.getByCy(selector)` | Get element by `data-cy` attribute |
