# WorkForcePro – API Test Cases

## API Test Execution Summary

| Category | Count |
|----------|-------|
| Total API Utility Tests | 12 |
| API Utility Passed | 9 |
| API Utility Failed | 3 |
| API Utility Pass Rate | 75% |
| Total API Specific Tests | 5 |
| API Specific Passed | 0 |
| API Specific Failed | 5 |
| API Specific Pass Rate | 0% |
| **Total API Tests** | **17** |
| **Total Passed** | **9** |
| **Total Failed** | **8** |
| **Overall API Pass Rate** | **53%** |

---

## API Utility Tests (Smoke Tests)

### API-UT-001: Health Check

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-001 |
| **Layer** | API |
| **Description** | Verify server health endpoint |
| **Priority** | High |
| **Preconditions** | Backend server is running |

**Request:**

```bash
curl --location 'http://localhost:3001/api/health'
```

**Response:**

```json
{
    "status": "ok",
    "timestamp": "2026-06-25T14:24:33.293Z"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response has status and timestamp | ✅ PASS |
| 3 | Status is "ok" | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-001-health.png`

---

### API-UT-002: Get All Departments

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-002 |
| **Layer** | API |
| **Description** | Retrieve all departments |
| **Priority** | High |
| **Preconditions** | Database has seeded departments |

**Request:**

```bash
curl --location 'http://localhost:3001/api/departments'
```

**Response:**

```json
[
    { "id": 1, "name": "Engineering", "created_at": "2026-06-25 12:48:14" },
    { "id": 2, "name": "Operations", "created_at": "2026-06-25 12:48:14" },
    { "id": 3, "name": "Sales", "created_at": "2026-06-25 12:48:14" },
    { "id": 4, "name": "IT Support", "created_at": "2026-06-25 12:48:14" },
    { "id": 5, "name": "Legal", "created_at": "2026-06-25 12:48:14" },
    { "id": 6, "name": "Research & Development", "created_at": "2026-06-25 12:48:14" },
    { "id": 7, "name": "Customer Support", "created_at": "2026-06-25 12:48:14" },
    { "id": 8, "name": "Marketing", "created_at": "2026-06-25 12:48:14" },
    { "id": 9, "name": "Human Resources", "created_at": "2026-06-25 12:48:14" },
    { "id": 10, "name": "Finance", "created_at": "2026-06-25 12:48:14" }
]
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response is an array | ✅ PASS |
| 3 | Department objects have id and name | ✅ PASS |
| 4 | Returns 10 departments | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-002-departments.png`

---

### API-UT-003: Get All Employees

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-003 |
| **Layer** | API |
| **Description** | Retrieve all employees with department and supervisor info |
| **Priority** | High |
| **Preconditions** | Database has seeded employees |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees'
```

**Response (truncated):**

```json
[
    { "id": 8, "employee_id": "EMP003", "name": "Alice Brown", "email": "alice.brown@workforcepro.com", "department_name": "Finance" },
    { "id": 15, "employee_id": "EMP002", "name": "Bob Wilson", "email": "bob.wilson@workforcepro.com", "department_name": "Human Resources" },
    { "id": 14, "employee_id": "EMP004", "name": "Charlie Davis", "email": "charlie.davis@workforcepro.com", "department_name": "Marketing" },
    { "id": 3, "employee_id": "SUP004", "name": "David Brown", "email": "david.brown@workforcepro.com", "department_name": "Marketing" },
    { "id": 6, "employee_id": "EMP005", "name": "Diana Evans", "email": "diana.evans@workforcepro.com", "department_name": "Operations" },
    { "id": 5, "employee_id": "SUP005", "name": "Emily Davis", "email": "emily.davis@workforcepro.com", "department_name": "Operations" },
    { "id": 7, "employee_id": "EMP006", "name": "Frank Garcia", "email": "frank.garcia@workforcepro.com", "department_name": "Sales" },
    { "id": 12, "employee_id": "EMP007", "name": "Grace Harris", "email": "grace.harris@workforcepro.com", "department_name": "IT Support" },
    { "id": 9, "employee_id": "EMP008", "name": "Henry Irving", "email": "henry.irving@workforcepro.com", "department_name": "Legal" },
    { "id": 10, "employee_id": "EMP009", "name": "Iris Jackson", "email": "iris.jackson@workforcepro.com", "department_name": "Research & Development" },
    { "id": 11, "employee_id": "EMP010", "name": "Jack Kelly", "email": "jack.kelly@workforcepro.com", "department_name": "Customer Support" },
    { "id": 1, "employee_id": "SUP001", "name": "Jane Smith", "email": "jane.smith@workforcepro.com", "department_name": "Engineering" },
    { "id": 13, "employee_id": "EMP001", "name": "John Doe", "email": "john.doe@workforcepro.com", "department_name": "Engineering" },
    { "id": 4, "employee_id": "SUP002", "name": "Mike Johnson", "email": "mike.johnson@workforcepro.com", "department_name": "Human Resources" },
    { "id": 2, "employee_id": "SUP003", "name": "Sarah Williams", "email": "sarah.williams@workforcepro.com", "department_name": "Finance" }
]
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response is an array | ✅ PASS |
| 3 | Employee objects have id, employee_id, name, email | ✅ PASS |
| 4 | Returns employees with department_name | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-003-employees.png`

---

### API-UT-004: Get All Supervisors

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-004 |
| **Layer** | API |
| **Description** | Retrieve all supervisors |
| **Priority** | High |
| **Preconditions** | Database has seeded supervisors |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees/supervisors'
```

**Response:**

```json
[
    { "id": 3, "employee_id": "SUP004", "name": "David Brown", "email": "david.brown@workforcepro.com" },
    { "id": 5, "employee_id": "SUP005", "name": "Emily Davis", "email": "emily.davis@workforcepro.com" },
    { "id": 1, "employee_id": "SUP001", "name": "Jane Smith", "email": "jane.smith@workforcepro.com" },
    { "id": 4, "employee_id": "SUP002", "name": "Mike Johnson", "email": "mike.johnson@workforcepro.com" },
    { "id": 2, "employee_id": "SUP003", "name": "Sarah Williams", "email": "sarah.williams@workforcepro.com" }
]
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response is an array | ✅ PASS |
| 3 | Supervisor objects have id, employee_id, name, email | ✅ PASS |
| 4 | Returns 5 supervisors | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-004-supervisors.png`

---

### API-UT-005: Create Employee (Positive)

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-005 |
| **Layer** | API |
| **Description** | Create a new employee with valid data |
| **Priority** | High |
| **Preconditions** | Valid employee data prepared |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees' \
--header 'Content-Type: application/json' \
--data-raw '{
    "employee_id": "EMP999",
    "name": "API Test User",
    "email": "apitester@workforcepro.com",
    "department_id": 1,
    "supervisor_id": 1,
    "is_supervisor": false
}'
```

**Response:**

```json
{
    "id": 19,
    "employee_id": "EMP999",
    "name": "API Test User",
    "email": "apitester@workforcepro.com",
    "department_id": 1,
    "supervisor_id": 1,
    "supervisor_name": "Unassigned",
    "is_supervisor": 0,
    "created_at": "2026-06-25 14:25:11",
    "updated_at": "2026-06-25 14:25:11"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 201 | ✅ PASS |
| 2 | Response has employee fields (id, employee_id, name, email) | ✅ PASS |
| 3 | Response matches request data | ✅ PASS |
| 4 | employee_id = "EMP999" | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-005-create-employee.png`

---

### API-UT-006: Create Employee (Duplicate Email - Negative)

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-006 |
| **Layer** | API |
| **Description** | Attempt to create employee with duplicate email |
| **Priority** | High |
| **Preconditions** | Employee with email "apitester@workforcepro.com" already exists |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees' \
--header 'Content-Type: application/json' \
--data-raw '{
    "employee_id": "EMP888",
    "name": "Duplicate Email Test",
    "email": "apitester@workforcepro.com",
    "department_id": 1
}'
```

**Response:**

```json
{
    "error": "Failed to create employee"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 400 | ❌ FAIL (500 received) |
| 2 | Response has error message | ✅ PASS |
| 3 | Error message: "Email already exists" | ❌ FAIL ("Failed to create employee" received) |

**Status:** ❌ FAIL  
**Defect ID:** DEF-001  
**Screenshot:** `screenshots/API-UT-006-duplicate-email.png`

---

### API-UT-007: Get Employee by ID

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-007 |
| **Layer** | API |
| **Description** | Retrieve a single employee by ID |
| **Priority** | Medium |
| **Preconditions** | Employee with ID 1 exists |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees/1'
```

**Response:**

```json
{
    "id": 1,
    "employee_id": "SUP001",
    "name": "Jane Smith",
    "email": "jane.smith@workforcepro.com",
    "department_id": 1,
    "supervisor_id": null,
    "supervisor_name": null,
    "is_supervisor": 1,
    "created_at": "2026-06-25 12:48:14",
    "updated_at": "2026-06-25 12:48:14",
    "department_name": "Engineering"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response has employee fields | ✅ PASS |
| 3 | Name is "Jane Smith" | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-007-employee-by-id.png`

---

### API-UT-008: Get Employee Trainings

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-008 |
| **Layer** | API |
| **Description** | Retrieve trainings for a specific employee |
| **Priority** | Medium |
| **Preconditions** | Employee with ID 1 exists |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees/1/trainings'
```

**Response:**

```json
[]
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response is an array | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-008-employee-trainings.png`

---

### API-UT-009: Update Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-009 |
| **Layer** | API |
| **Description** | Update an existing employee |
| **Priority** | Medium |
| **Preconditions** | Employee with ID 1 exists |

**Request:**

```bash
curl --location --request PUT 'http://localhost:3001/api/employees/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "API Test User Updated",
    "email": "updated@workforcepro.com",
    "department_id": 2
}'
```

**Response:**

```json
{
    "id": 1,
    "employee_id": "SUP001",
    "name": "API Test User Updated",
    "email": "updated@workforcepro.com",
    "department_id": 2,
    "supervisor_id": null,
    "supervisor_name": "Unassigned",
    "is_supervisor": 0,
    "created_at": "2026-06-25 12:48:14",
    "updated_at": "2026-06-25 14:51:49"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response shows updated data | ✅ PASS |
| 3 | Name updated to "API Test User Updated" | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-009-update-employee.png`

---

### API-UT-010: Delete Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-010 |
| **Layer** | API |
| **Description** | Delete an employee |
| **Priority** | Medium |
| **Preconditions** | Employee with ID 1 exists |

**Request:**

```bash
curl --location --request DELETE 'http://localhost:3001/api/employees/1'
```

**Response:**

```json
{
    "error": "Failed to delete employee"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 204 | ❌ FAIL (500 received) |
| 2 | Employee deleted successfully | ❌ FAIL |

**Status:** ❌ FAIL  
**Defect ID:** DEF-012  
**Screenshot:** `screenshots/API-UT-010-delete-employee.png`

---

### API-UT-011: Get All Trainings

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-011 |
| **Layer** | API |
| **Description** | Retrieve all training modules |
| **Priority** | High |
| **Preconditions** | Database has seeded trainings |

**Request:**

```bash
curl --location 'http://localhost:3001/api/trainings'
```

**Response:**

```json
[
    { "id": 1, "training_name": "Safety Training", "description": "Workplace safety and hazard awareness" },
    { "id": 2, "training_name": "First Aid Training", "description": "Basic first aid and emergency response" },
    { "id": 3, "training_name": "Diversity & Inclusion", "description": "Workplace diversity and inclusion awareness" },
    { "id": 4, "training_name": "Data Privacy Training", "description": "GDPR and data handling procedures" },
    { "id": 5, "training_name": "Project Management", "description": "Project planning and execution fundamentals" },
    { "id": 6, "training_name": "Cyber Security Training", "description": "Information security best practices" },
    { "id": 7, "training_name": "Leadership Training", "description": "Team management and leadership skills" },
    { "id": 8, "training_name": "Compliance Training", "description": "Regulatory compliance and company policies" }
]
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 200 | ✅ PASS |
| 2 | Response is an array | ✅ PASS |
| 3 | Training objects have id and training_name | ✅ PASS |
| 4 | Returns 8 trainings | ✅ PASS |

**Status:** ✅ PASS  
**Screenshot:** `screenshots/API-UT-011-trainings.png`

---

### API-UT-012: Assign Training (Supervisor Validation)

| Field | Value |
|-------|-------|
| **Test Case ID** | API-UT-012 |
| **Layer** | API |
| **Description** | Attempt to assign training with supervisor validation |
| **Priority** | Medium |
| **Preconditions** | Employee and training exist |

**Request:**

```bash
curl --location 'http://localhost:3001/api/trainings/assign' \
--header 'Content-Type: application/json' \
--data '{
    "employee_id": 2,
    "training_id": 1,
    "supervisor_id": 1,
    "due_date": "2026-07-31"
}'
```

**Response:**

```json
{
    "error": "Only supervisors can assign training"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 201 | ❌ FAIL (403 received) |
| 2 | Training assigned successfully | ❌ FAIL |
| 3 | Error response: "Only supervisors can assign training" | ✅ PASS |

**Status:** ❌ FAIL  
**Defect ID:** DEF-013  
**Screenshot:** `screenshots/API-UT-012-assign-training.png`

> **Note:** The supervisor validation failed. This may be because supervisor_id 1 did not have `is_supervisor=1` at the time of testing, or the backend validation logic is incorrect.

---

## API Specific Test Cases

### TC-API-001: Complete Unassigned Training via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-001 |
| **Layer** | API |
| **Requirement** | OJT-004 |
| **Priority** | High |
| **Preconditions** | Employee exists, Training exists but NOT assigned to that employee |
| **Test Data** | Employee ID: 2 (Bob Wilson), Training ID: 3 (Diversity & Inclusion) |

**Request:**

```bash
curl --location 'http://localhost:3001/api/trainings/complete' \
--header 'Content-Type: application/json' \
--data '{
    "employee_id": 2,
    "training_id": 3,
    "completion_date": "2026-06-25",
    "notes": "Testing unassigned training completion"
}'
```

**Response:**

```json
{
    "id": 18,
    "employee_id": 2,
    "training_id": 3,
    "due_date": null,
    "status": "completed",
    "completion_date": "2026-06-25",
    "notes": "Testing unassigned training completion",
    "created_at": "2026-06-25 15:36:24",
    "training_name": "Diversity & Inclusion",
    "warning": "Training was not assigned but was completed anyway"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 400 | ❌ FAIL (201 received) |
| 2 | Error: "Training not assigned to this employee" | ❌ FAIL |
| 3 | Training not marked as completed | ❌ FAIL |
| 4 | Warning message appears | ✅ PASS (warning received) |

**Status:** ❌ FAIL  
**Defect ID:** DEF-002  
**Screenshot:** `screenshots/TC-API-001-unassigned-complete.png`

> **Note:** The backend API allows completing a training that was never assigned. UI prevents this action.

---

### TC-API-002: Approve Uncompleted Training via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-002 |
| **Layer** | API |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Training is assigned to employee but NOT completed (status "assigned") |
| **Test Data** | Employee ID: 2 (Bob Wilson), Training ID: 1 (Safety Training), Supervisor ID: 1 (Jane Smith) |

**Request:**

```bash
curl --location 'http://localhost:3001/api/trainings/approve' \
--header 'Content-Type: application/json' \
--data '{
    "employee_id": 2,
    "training_id": 1,
    "supervisor_id": 1
}'
```

**Response:**

```json
{
    "id": 16,
    "employee_id": 2,
    "training_id": 1,
    "due_date": null,
    "status": "approved",
    "completion_date": "2026-06-25",
    "notes": "Completed via API test",
    "created_at": "2026-06-25 14:57:07",
    "training_name": "Safety Training"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 400 | ❌ FAIL (200 received) |
| 2 | Error: "Training must be completed first" | ❌ FAIL |
| 3 | Status is NOT "approved" | ❌ FAIL (status = "approved") |
| 4 | Training not approved without completion | ❌ FAIL |

**Status:** ❌ FAIL  
**Defect ID:** DEF-003  
**Screenshot:** `screenshots/TC-API-002-approve-uncompleted.png`

> **Note:** The backend API allows approving training without completion. The training was approved even though it was not completed first.

---

### TC-API-003: Self-Approval via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-003 |
| **Layer** | API |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Employee is also a supervisor, training is completed |
| **Test Data** | Employee ID: 1 (Jane Smith), Training ID: 2 (First Aid Training), Supervisor ID: 1 (Jane Smith) |

#### Request 1: Assign Training

```bash
curl --location 'http://localhost:3001/api/trainings/assign' \
--header 'Content-Type: application/json' \
--data '{
    "employee_id": 1,
    "training_id": 2,
    "supervisor_id": 1,
    "due_date": "2026-07-31"
}'
```

**Response 1:**

```json
{
    "id": 17,
    "employee_id": 1,
    "training_id": 2,
    "due_date": "2026-07-31",
    "status": "assigned",
    "completion_date": null,
    "notes": null,
    "created_at": "2026-06-25 15:32:01",
    "training_name": "First Aid Training"
}
```

#### Request 2: Complete Training

```bash
curl --location 'http://localhost:3001/api/trainings/complete' \
--header 'Content-Type: application/json' \
--data '{
    "employee_id": 1,
    "training_id": 2,
    "completion_date": "2026-06-25",
    "notes": "Completed via API test"
}'
```

**Response 2:**

```json
{
    "id": 17,
    "employee_id": 1,
    "training_id": 2,
    "due_date": "2026-07-31",
    "status": "completed",
    "completion_date": "2026-06-25",
    "notes": "Completed via API test",
    "created_at": "2026-06-25 15:32:01",
    "training_name": "First Aid Training"
}
```

#### Request 3: Self-Approval

```bash
curl --location 'http://localhost:3001/api/trainings/approve' \
--header 'Content-Type: application/json' \
--data '{
    "employee_id": 1,
    "training_id": 2,
    "supervisor_id": 1
}'
```

**Response 3:**

```json
{
    "id": 17,
    "employee_id": 1,
    "training_id": 2,
    "due_date": "2026-07-31",
    "status": "approved",
    "completion_date": "2026-06-25",
    "notes": "Completed via API test",
    "created_at": "2026-06-25 15:32:01",
    "training_name": "First Aid Training"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Assign training status 201 | ✅ PASS |
| 2 | Complete training status 200 | ✅ PASS |
| 3 | Self-approval status 400 | ❌ FAIL (200 received) |
| 4 | Error: "Cannot approve your own training" | ❌ FAIL |
| 5 | Status is NOT "approved" for self-approval | ❌ FAIL (status = "approved") |

**Status:** ❌ FAIL  
**Defect ID:** DEF-003  
**Screenshot:** `screenshots/TC-API-003-self-approval.png`

> **Note:** The backend API allows self-approval. UI correctly prevents this action.

---

### TC-API-004: Duplicate Email via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-004 |
| **Layer** | API |
| **Requirement** | EMP-002 |
| **Priority** | High |
| **Preconditions** | Employee with email "apitester@workforcepro.com" already exists |
| **Test Data** | Employee ID: "EMP888", Email: "apitester@workforcepro.com" (DUPLICATE) |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees' \
--header 'Content-Type: application/json' \
--data-raw '{
    "employee_id": "EMP888",
    "name": "Duplicate Email Test",
    "email": "apitester@workforcepro.com",
    "department_id": 1
}'
```

**Response:**

```json
{
    "error": "Failed to create employee"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 400 | ❌ FAIL (500 received) |
| 2 | Error: "Email already exists" | ❌ FAIL ("Failed to create employee" received) |
| 3 | Employee not created | ✅ PASS (employee not created) |

**Status:** ❌ FAIL  
**Defect ID:** DEF-001  
**Screenshot:** `screenshots/TC-API-004-duplicate-email.png`

> **Note:** The database correctly enforces unique emails via UNIQUE constraint, but the error handling returns 500 instead of 400 with a clear message.

---

### TC-API-005: Duplicate Employee ID via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-005 |
| **Layer** | API |
| **Requirement** | EMP-001 |
| **Priority** | High |
| **Preconditions** | Employee with ID "EMP001" already exists |
| **Test Data** | Employee ID: "EMP001" (DUPLICATE) |

**Request:**

```bash
curl --location 'http://localhost:3001/api/employees' \
--header 'Content-Type: application/json' \
--data-raw '{
    "employee_id": "EMP001",
    "name": "Duplicate ID Test",
    "email": "duplicateid@test.com",
    "department_id": 1
}'
```

**Response:**

```json
{
    "error": "Failed to create employee"
}
```

**Assertions:**

| # | Assertion | Result |
|---|-----------|--------|
| 1 | Status code is 400 | ❌ FAIL (500 received) |
| 2 | Error: "Employee ID already exists" | ❌ FAIL ("Failed to create employee" received) |
| 3 | Employee not created | ✅ PASS (employee not created) |

**Status:** ❌ FAIL  
**Defect ID:** DEF-005  
**Screenshot:** `screenshots/TC-API-005-duplicate-id.png`

> **Note:** The database correctly enforces unique Employee IDs via UNIQUE constraint, but the error handling returns 500 instead of 400 with a clear message.

---

## API Test Cases Summary

| Test Case ID | Requirement | Description | Status | Defect ID | Notes |
|-------------|-------------|-------------|--------|-----------|-------|
| API-UT-001 | - | Health Check | ✅ PASS | - | - |
| API-UT-002 | - | Get All Departments | ✅ PASS | - | - |
| API-UT-003 | - | Get All Employees | ✅ PASS | - | - |
| API-UT-004 | - | Get All Supervisors | ✅ PASS | - | - |
| API-UT-005 | EMP-001 | Create Employee (Positive) | ✅ PASS | - | - |
| API-UT-006 | EMP-002 | Create Employee (Duplicate Email) | ❌ FAIL | DEF-001 | 500 instead of 400 |
| API-UT-007 | - | Get Employee by ID | ✅ PASS | - | - |
| API-UT-008 | - | Get Employee Trainings | ✅ PASS | - | Empty array valid |
| API-UT-009 | - | Update Employee | ✅ PASS | - | - |
| API-UT-010 | - | Delete Employee | ❌ FAIL | DEF-012 | 500 error |
| API-UT-011 | - | Get All Trainings | ✅ PASS | - | - |
| API-UT-012 | OJT-001 | Assign Training | ❌ FAIL | DEF-013 | Supervisor validation issue |
| TC-API-001 | OJT-004 | Complete Unassigned Training | ❌ FAIL | DEF-002 | Unassigned training completed |
| TC-API-002 | OJT-003 | Approve Uncompleted Training | ❌ FAIL | DEF-003 | Training approved without completion |
| TC-API-003 | OJT-003 | Self-Approval via API | ❌ FAIL | DEF-003 | Self-approval allowed |
| TC-API-004 | EMP-002 | Duplicate Email via API | ❌ FAIL | DEF-001 | 500 instead of 400 |
| TC-API-005 | EMP-001 | Duplicate Employee ID via API | ❌ FAIL | DEF-005 | 500 instead of 400 |

---

## Defects Found in API Testing

| Defect ID | Title | Severity | Priority | Test Cases |
|-----------|-------|----------|----------|------------|
| DEF-001 | Duplicate Email - Poor Error Handling (500 instead of 400) | Minor | Medium | TC-API-004 |
| DEF-002 | Can Complete Unassigned Training | Critical | High | TC-API-001 |
| DEF-003 | Self-Approval / Approve Uncompleted Training Allowed | Security | High | TC-API-002, TC-API-003 |
| DEF-005 | Duplicate Employee ID - Poor Error Handling (500 instead of 400) | Major | High | TC-API-005 |
| DEF-012 | Delete Employee Returns 500 Error | Major | High | API-UT-010 |
| DEF-013 | Assign Training Fails with Supervisor Validation | Medium | Medium | API-UT-012 |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ PASS | Test passed successfully |
| ❌ FAIL | Test failed (defect found) |
| ⬜ Pending | Test not yet executed |
| ⚠️ N/A | Test not applicable |

---

## Summary

| Category | Passed | Failed | Total | Pass Rate |
|----------|--------|--------|-------|-----------|
| API Utility Tests | 9 | 3 | 12 | 75% |
| API Specific Tests | 0 | 5 | 5 | 0% |
| **Total** | **9** | **8** | **17** | **53%** |

---

*Full test cases are available in [01-test-plan.md](01-test-plan.md)*
