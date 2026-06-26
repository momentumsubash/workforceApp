# WorkForcePro – Defect Reports

## Defect Summary

| Defect ID | Title | Severity | Priority | Status | Test Cases |
|-----------|-------|----------|----------|--------|------------|
| DEF-001 | Duplicate Email - Poor Error Handling (500 instead of 400) | Minor | Medium | Open | TC-003, TC-API-004 |
| DEF-002 | Can Complete Unassigned Training | Critical | High | Open | TC-API-001 |
| DEF-003 | Self-Approval / Approve Uncompleted Training Allowed | Security | High | Open | TC-011, TC-012, TC-API-002, TC-API-003 |
| DEF-004 | Expiration Alert Off by 30 Days | Minor | Medium | Open | TC-015, TC-016 |
| DEF-005 | Employee ID Uniqueness - Poor Error Handling (500 instead of 400) | Major | High | Open | TC-005, TC-API-005 |
| DEF-006 | Frontend Shows Generic Error for Duplicate Email | Minor | Low | Open | TC-003 |
| DEF-007 | Training List Page Not Showing All Trainings | Major | High | Open | TC-026 |
| DEF-008 | Certification Not Created After Training Approval | Major | High | Open | TC-027 |
| DEF-009 | No Certification Option After Training Approval | Medium | Medium | Open | TC-028 |
| DEF-010 | No UI Option to Create Certification Manually | Major | High | Open | TC-014 |
| DEF-011 | Approved Trainings Not Listed in Certifications | Major | High | Open | TC-029 |
| DEF-012 | Delete Employee Returns 500 Error | Major | High | Open | API-UT-010 |
| DEF-013 | PUT /api/employees/:id Overwrites is_supervisor to 0 | Major | High | Open | API-UT-009 |

---

## DEF-001: Duplicate Email - Poor Error Handling

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-001 |
| **Title** | Duplicate Email - Poor Error Handling (500 instead of 400) |
| **Test Cases** | TC-003, TC-API-004 |
| **Severity** | Minor |
| **Priority** | Medium |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

The database correctly enforces unique emails via a `UNIQUE` constraint. However, when a duplicate email is attempted, the backend returns a `500 Internal Server Error` instead of a proper `400 Bad Request` with a clear message.

### Screenshot

![DEF-001-DEF-006-duplicate-email.png](screenshots/DEF-001-DEF-006-duplicate-email.png)

### Suggested Fix

In `backend/routes/employees.js`, catch the constraint error:

```javascript
try {
  // insert employee
} catch (error) {
  if (error.message.includes('UNIQUE constraint failed')) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  return res.status(500).json({ error: 'Failed to create employee' });
}
```

---

## DEF-002: Can Complete Unassigned Training

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-002 |
| **Title** | Can Complete Unassigned Training |
| **Test Cases** | TC-API-001 |
| **Severity** | Critical |
| **Priority** | High |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

The backend API allows completing a training that was never assigned. UI prevents this, but the API vulnerability remains.

### Screenshot

![DEF-002-training-modal-open.png](screenshots/DEF-002-training-modal-open.png) ![DEF-002-unassigned-training-list.png](screenshots/DEF-002-unassigned-training-list.png)

### Suggested Fix

Check if training is assigned before allowing completion:

```javascript
const record = employeeTrainings.find(
  et => et.training_id === training_id && et.employee_id === employee_id
);
if (!record) {
  return res.status(400).json({ error: 'Training not assigned to this employee' });
}
```

---

## DEF-003: Self-Approval Allowed

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-003 |
| **Title** | Self-Approval Allowed |
| **Test Cases** | TC-012, TC-API-002, TC-API-003 |
| **Severity** | Security |
| **Priority** | High |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

Employees can approve their own training (self-approval). The UI has been updated to prevent approving uncompleted training (only shows "Complete" button), but self-approval is still possible.

### Steps to Reproduce (UI)

1. Assign training to an employee who is also a supervisor
2. Complete the training
3. Click "Approve" on own training

### Steps to Reproduce (API)

1. Send POST request to `/api/trainings/approve`
2. Body: `{ "employee_id": 123, "training_id": 456, "supervisor_id": 123 }`

### Expected Result

Error: "Cannot approve your own training"

### Actual Result

Training is approved successfully

### Impact

- Security vulnerability
- Invalid training approvals
- Compliance risk

### Screenshot

![Self-Approval](https://imgur.com/jOQY8cF)

### Suggested Fix

Add validation check:

```javascript
if (supervisor_id && parseInt(supervisor_id) === parseInt(employee_id)) {
  return res.status(400).json({ error: 'Cannot approve your own training' });
}
```

---

## DEF-004: Expiration Alert Off by 30 Days

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-004 |
| **Title** | Expiration Alert Off by 30 Days |
| **Test Cases** | TC-015, TC-016 |
| **Severity** | Minor |
| **Priority** | Medium |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

The certification expiration alert has an off-by-one error. Certifications expiring exactly at 30 days are NOT shown.

### Screenshot

![DEF-004-expiry-bug.png](screenshots/DEF-004-expiry-bug.png)

### Suggested Fix

Change `< 30` to `<= 30` in SQL query.

---

## DEF-005: Employee ID Uniqueness - Poor Error Handling

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-005 |
| **Title** | Employee ID Uniqueness - Poor Error Handling (500 instead of 400) |
| **Test Cases** | TC-005, TC-API-005 |
| **Severity** | Major |
| **Priority** | High |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

The database correctly enforces unique Employee IDs, but duplicate attempts return a 500 error instead of 400.

### Screenshot

![DEF-005-duplicate-id-error.png](screenshots/DEF-005-duplicate-id-error.png)

### Suggested Fix

Catch constraint error and return proper 400 response.

---

## DEF-006: Frontend Shows Generic Error for Duplicate Email

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-006 |
| **Title** | Frontend Shows Generic Error for Duplicate Email |
| **Test Cases** | TC-003 |
| **Severity** | Minor |
| **Priority** | Low |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

When duplicate email is blocked, frontend shows generic "Failed to create employee" instead of meaningful error.

### Screenshot

![DEF-001-DEF-006-duplicate-email.png](screenshots/DEF-001-DEF-006-duplicate-email.png) ![DEF-001-duplicate-email-error.png](screenshots/DEF-001-duplicate-email-error.png)

### Suggested Fix

1. Backend: Return proper 400 error (see DEF-001)
2. Frontend: Display specific error message from response

---

## DEF-007: Training List Page Not Showing All Trainings

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-007 |
| **Title** | Training List Page Not Showing All Trainings |
| **Test Cases** | TC-026 |
| **Severity** | Major |
| **Priority** | High |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

The `/trainings` page is not displaying the full list of available training modules, making it difficult to manage training assignments. The page appears to be empty or only showing a subset of trainings.

### Steps to Reproduce

1. Navigate to `http://localhost:3000/trainings`
2. Observe the training list
3. Note that some trainings are not visible

### Expected Result

All training modules should be listed with their details.

### Actual Result

Training list is empty or incomplete.

### Impact

- Difficult to manage training assignments
- Poor user experience
- Cannot verify available trainings

### Suggested Fix

Check the API call to `/api/trainings` and ensure the frontend renders all returned trainings.

---

## DEF-008: Certification Not Created After Training Approval

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-008 |
| **Title** | Certification Not Automatically Created After Training Approval |
| **Test Cases** | TC-027 |
| **Severity** | Major |
| **Priority** | High |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

When a training is approved, the system should automatically create a certification for the employee. Currently, this does not happen, and there is no manual option to create a certification from an approved training.

### Steps to Reproduce

1. Create an employee
2. Assign a training
3. Complete the training
4. Approve the training (status changes to "approved")
5. Check certifications page

### Expected Result

A certification should appear in the certifications list for the employee.

### Actual Result

No certification is created for the employee.

### Impact

- Users don't receive certifications for completed trainings
- Training completion cannot be verified
- Missing compliance documentation

### Suggested Fix

Add auto-certification logic in the training approval endpoint, or provide a manual "Create Certification" button.

---

## DEF-009: No Certification Option After Training Approval

| Field | Value |
|-------|-------|
| **Defect ID** | DEF-009 |
| **Title** | No Certification Option After Training Approval |
| **Test Cases** | TC-028 |
| **Severity** | Medium |
| **Priority** | Medium |
| **Reported By** | Subash Acharya |
| **Date Found** | June 25, 2026 |
| **Environment** | Localhost |

### Description

After a training is approved, the training page shows only "✅ Approved" text with no option to create a certification from the approved training. There is no button, link, or automatic process to convert an approved training into a certification.

### Steps to Reproduce

1. Complete the full training flow (assign → complete → approve)
2. Observe the approved training row on the Training page
3. Look for any certification-related action (button, link, auto-creation)

### Expected Result

Either:
- Certification is auto-created on approval (preferred), OR
- A button/link is available to manually create a certification from the approved training

### Actual Result

After approval, the row shows "✅ Approved" with no further actions available. No certification is created, and no manual option exists on the training page.

### Impact

- Users cannot get certifications through the training workflow
- Incomplete workflow
- Manual workaround required (create certification directly via API)

### Suggested Fix

1. Option A: Auto-create certification on approval (recommended)
2. Option B: Add a "Create Certification" button on the approved training row
3. Option C: Add a "Create Certification" button on the certifications page
