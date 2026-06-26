# WorkForcePro — Frontend

React application for workforce management — employee records, OJT training, certifications, and reports.

## Tech Stack

- **Framework:** React 18
- **Routing:** React Router DOM v7
- **HTTP:** Axios
- **Build:** Create React App (react-scripts 5)
- **Port:** 3000

## Pages

| Page | Route | Role Access |
|------|-------|-------------|
| Login | `/` | Public |
| Dashboard | `/dashboard` | All |
| Employees | `/employees` | Supervisor only |
| Trainings | `/trainings` | All |
| Certifications | `/certifications` | All |
| Reports | `/reports` | Supervisor only |

## Project Structure

```
frontend/src/
├── App.js                    # Root component with routing
├── App.css
├── pages/
│   ├── Login.js              # Login with demo buttons
│   ├── Dashboard.js          # Stats overview
│   ├── Employees.js          # Employee management
│   ├── Trainings.js          # Training workflow
│   ├── Certifications.js     # Certification management
│   └── Reports.js            # Compliance reports
├── components/
│   ├── common/               # Header, Sidebar, Layout, Footer
│   ├── employees/            # EmployeeList, EmployeeModal, EmployeeForm
│   ├── trainings/            # TrainingList, TrainingAssign, etc.
│   └── certifications/       # CertificationList, CertificationForm, CertificationModal
└── services/
    └── api.js                # Axios API client
```

## How to Run

```bash
cd workforceApp/frontend
npm install
npm start
```

The app opens at `http://localhost:3000` and expects the backend at `http://localhost:3001`.

## Instrumentation for Coverage

To enable Cypress code coverage, start with:

```bash
npm start
```

The `@cypress/instrument-cra` wrapper is already configured in `package.json`.
