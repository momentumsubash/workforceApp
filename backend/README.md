# WorkForcePro — Backend

Express + SQLite REST API for employee management, OJT training tracking, certification management, and compliance reporting.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** SQLite (via `sqlite3` driver)
- **Port:** 3001

## Project Structure

```
backend/
├── server.js              # Entry point, Express app setup
├── db/
│   ├── database.js        # SQLite connection + schema + async helpers
│   └── workforcepro.db    # SQLite database file (seeded)
├── routes/
│   ├── employees.js       # CRUD + departments for employees
│   ├── trainings.js       # Assign, complete, approve, reject
│   └── certifications.js  # CRUD + expiring endpoint
└── middleware/
    └── validation.js      # Validation middleware (some checks commented out)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/:id/trainings` | Get employee trainings |
| GET | `/api/departments` | List departments |
| POST | `/api/trainings/assign` | Assign training |
| POST | `/api/trainings/complete` | Complete training |
| POST | `/api/trainings/approve` | Approve training |
| GET | `/api/certifications` | List certifications |
| POST | `/api/certifications` | Create certification |
| DELETE | `/api/certifications/:id` | Delete certification |
| GET | `/api/certifications/expiring` | Expiring certifications (bug: uses < not <=) |

## How to Run

```bash
cd workforceApp/backend
npm install
npm start
```

The server starts on `http://localhost:3001`.

## Known Bugs (Intentional)

See `test-artifacts/04-defect-reports.md` for full details.
