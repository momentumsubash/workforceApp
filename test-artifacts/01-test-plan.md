# WorkForcePro – QA Test Plan

## 1.0 Document Information

| Field | Value |
|-------|-------|
| **Document Title** | WorkForcePro QA Test Plan |
| **Version** | 1.0 |
| **Date** | June 25, 2026 |
| **Prepared By** | Subash Acharya |
| **Application** | WorkForcePro - Workforce Management & OJT Platform |
| **Test Environment** | Localhost (Backend: Port 3001, Frontend: Port 3000) |
| **Test Type** | Functional, Negative, Security, Validation, Usability |

---

## 2.0 Introduction

### 2.1 Purpose
The purpose of this test plan is to systematically validate the WorkForcePro platform's functionality, identify defects, and ensure the system meets all specified requirements before release.

### 2.2 Scope
This test plan covers:
- Employee Management (Create, Read, Update, Delete)
- Training Management (Assign, Complete, Approve, Reject)
- Certification Management (Create, Track Expiry, Delete)
- Dashboard Statistics and Data Accuracy
- Navigation and UI/UX Behaviors
- API Endpoint Validation
- Database Integrity and Business Rules

### 2.3 Out of Scope
- Performance/Load Testing
- Security Penetration Testing
- Mobile App Testing
- Browser Compatibility Testing
- Automated CI/CD Pipeline Testing

---

## 3.0 Test Strategy

### 3.1 Testing Approach

| Phase | Activity | Description |
|-------|----------|-------------|
| **Phase 1** | Requirements Review | Understand all functional requirements |
| **Phase 2** | Test Design | Create test cases covering all scenarios |
| **Phase 3** | Test Execution | Run test cases and document results with screenshots |
| **Phase 4** | Defect Reporting | Log all identified issues with severity and priority |
| **Phase 5** | Regression Testing | Retest after fixes |

### 3.2 Testing Types

| Type | Purpose |
|------|---------|
| **Positive Testing** | Verify system works as expected with valid data |
| **Negative Testing** | Verify system handles invalid/edge cases properly |
| **Functional Testing** | Validate business rules and workflows |
| **Integration Testing** | Test API endpoints and database interactions |
| **UI/UX Testing** | Validate user interface and user experience |
| **Data Validation** | Verify data integrity and business rules |
| **Security Testing** | Identify authorization and access control issues |

### 3.3 Test Environment

| Component | Details |
|-----------|---------|
| **Backend** | Node.js v24.0.2, Express 4.18, SQLite3 |
| **Frontend** | React 18, React Router DOM v7, Axios |
| **Database** | SQLite (workforcepro.db) |
| **Browser** | Google Chrome (latest) |
| **API Client** | Browser Network Tab / Postman |
| **Test Data** | Seeded database with 10 employees, 8 trainings, 13 assignments, 12 certifications |
| **OS** | Windows 10 |

---

## 4.0 Requirements Coverage Matrix

| Requirement ID | Description | Test Cases | Priority |
|----------------|-------------|------------|----------|
| EMP-001 | Users can create employee records | TC-001, TC-002, TC-005 | High |
| EMP-002 | Employee email addresses must be unique | TC-003, TC-004 | High |
| EMP-003 | Employees can be assigned to a department | TC-001 | Medium |
| OJT-001 | Supervisors can assign OJT training modules | TC-006 | High |
| OJT-002 | Employees can mark assigned training as completed | TC-008 | High |
| OJT-003 | Completed training requires supervisor approval | TC-010, TC-012 | High |
| OJT-004 | Employees cannot complete unassigned training | TC-API-001 | High |
| CERT-001 | Employees can hold multiple certifications | TC-013, TC-014, TC-027, TC-028, TC-029 | Medium |
| CERT-002 | Certification expiration dates must be tracked | TC-013 | Medium |
| CERT-003 | System identifies certifications expiring within 30 days | TC-015, TC-016 | Medium |
| GEN-001 | Navigation menu functions correctly | TC-017 | Medium |
| GEN-002 | Page refresh preserves data | TC-018 | Low |
| GEN-003 | Modal dialogs open and close properly | TC-019 | Low |
| GEN-004 | Dashboard loads and displays correct stats | TC-020, TC-021, TC-022, TC-023, TC-024, TC-025 | High |
| GEN-005 | Training list page displays all modules | TC-026 | High |

---

## 5.0 Detailed Test Cases

### Section 5.1: Employee Management Tests (TC-001 - TC-005)

---

#### TC-001: Create Employee with Valid Data

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-001 |
| **Requirement** | EMP-001, EMP-003 |
| **Priority** | High |
| **Preconditions** | User is on Employees page, database has departments and supervisors seeded |
| **Test Data** | Name: "Test User QA", Email: "testqa@workforcepro.com", ID: "EMP999", Department: "Engineering", Supervisor: "John Doe" |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Employee" button | Modal opens with empty form |
| 2 | Enter valid Employee ID "EMP999" | Field accepts input |
| 3 | Enter valid Name "Test User QA" | Field accepts input |
| 4 | Enter valid Email "testqa@workforcepro.com" | Field accepts input |
| 5 | Select Department "Engineering" | Department is selected from dropdown |
| 6 | Select Supervisor "John Doe" | Supervisor is selected from dropdown |
| 7 | Click "Create Employee" | Employee is created and appears in list |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-001-create-employee-result.png`

---

#### TC-002: Create Employee with Missing Required Fields

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-002 |
| **Requirement** | EMP-001 |
| **Priority** | High |
| **Preconditions** | User is on Employees page |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Employee" | Modal opens with form |
| 2 | Leave Employee ID blank | Form shows HTML5 validation error on submit |
| 3 | Leave Name blank | Form shows HTML5 validation error on submit |
| 4 | Leave Email blank | Form shows HTML5 validation error on submit |
| 5 | Click "Create Employee" | HTML5 validation prevents submission, employee not created |

**Status:** ✅ PASS
**Note:** UI updated with HTML5 validation. Users cannot submit form with empty required fields.
**Screenshot:** `screenshots/TC-002-missing-fields-validation.png`

---

#### TC-003: Create Employee with Duplicate Email

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-003 |
| **Requirement** | EMP-002 |
| **Priority** | High |
| **Preconditions** | Employee with email "momentum.acharya@gmail.com" exists in database |
| **Test Data** | Employee ID: "1555", Name: "Duplicate Test", Email: "momentum.acharya@gmail.com" (duplicate) |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Click "Add Employee" | Modal opens | ✅ Modal opens |
| 2 | Fill all fields with existing email | Form accepts data | ✅ Form accepts data |
| 3 | Click "Create Employee" | Error: "Email must be unique" (400) | ❌ 500 Internal Server Error |
| 4 | Verify employee not created | Employee does NOT appear in list | ❌ Employee not created but UI shows generic error |

**Status:** ❌ FAIL
**Defect:** DEF-001, DEF-006
**Screenshot:** `screenshots/TC-003-duplicate-email-result.png`

---

#### TC-004: Create Employee with Unique Email (Positive)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-004 |
| **Requirement** | EMP-002 |
| **Priority** | High |
| **Preconditions** | User is on Employees page |
| **Test Data** | Employee ID: "EMP888", Name: "Unique Test", Email: "unique@workforcepro.com" |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Employee" | Modal opens |
| 2 | Fill all fields with valid, unique email | Form accepts data |
| 3 | Click "Create Employee" | Employee created successfully (201) |
| 4 | Verify employee appears in list | New employee visible in table |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-004-unique-email-result.png`

---

#### TC-005: Create Employee with Duplicate Employee ID

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-005 |
| **Requirement** | EMP-001 (implied uniqueness) |
| **Priority** | High |
| **Preconditions** | Employee with ID "EMP001" exists in database |
| **Test Data** | Employee ID: "EMP001" (duplicate), Name: "Duplicate ID Test", Email: "duplicateid@test.com" |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Click "Add Employee" | Modal opens | ✅ Modal opens |
| 2 | Enter duplicate Employee ID "EMP001" | Field accepts input | ✅ Field accepts input |
| 3 | Fill remaining fields | Form accepts data | ✅ Form accepts data |
| 4 | Click "Create Employee" | Error: "Employee ID must be unique" (400) | ✅ "Employee ID must be unique" error shown |
| 5 | Verify employee not created | Employee does NOT appear in list | ✅ Employee NOT created |

**Status:** ✅ PASS
**Defect:** - (Fixed)
**Screenshot:** `screenshots/TC-005-duplicate-id-result.png`

---

### Section 5.2: Training Management Tests (TC-006 - TC-012)

---

#### TC-006: Assign Training to Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-006 |
| **Requirement** | OJT-001 |
| **Priority** | High |
| **Preconditions** | Employee exists, Training module exists in database |
| **Test Data** | Employee: John Doe (EMP001), Training: Safety Training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Employees page | Employee list loads with all employees |
| 2 | Click 📚 (Trainings) button on an employee | Training modal opens with assign dropdown and current trainings table |
| 3 | Select "Safety Training" from the "Assign New Training" dropdown | Training is immediately assigned |
| 4 | Verify training appears in Current Trainings table | Training appears with status "assigned" and due date |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-006-assign-training-result.png`

---

#### TC-007: Assign Training Without Selecting Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-007 |
| **Requirement** | OJT-001 |
| **Priority** | Medium |
| **Preconditions** | User is on Employees page |
| **Note** | UI updated — training can only be assigned after selecting an employee via the 📚 button. Assign UI is embedded in the training modal which requires an employee context. |

**Status:** ⚠️ N/A

---

#### TC-008: Complete Assigned Training

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-008 |
| **Requirement** | OJT-002 |
| **Priority** | High |
| **Preconditions** | Employee has assigned training with status "assigned" |
| **Test Data** | Employee: Jane Smith (EMP002), Training: Safety Training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open employee's training modal via 📚 button | Training list loads with current assignments |
| 2 | Locate assigned training in Current Trainings table | Status shows "assigned" with ✅ Complete button |
| 3 | Click "Complete" button | Training status changes to "completed" |
| 4 | Verify status updated in table | Status now shows "completed" with Approve button |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-008-complete-training-result.png`

---

#### TC-009: Complete Unassigned Training

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-009 |
| **Requirement** | OJT-004 |
| **Priority** | High |
| **Preconditions** | Employee exists, Training exists but NOT assigned to that employee |
| **Note** | UI only lists assigned trainings in the Current Trainings table. There is no UI path to complete an unassigned training. However, backend API still allows it (see DEF-002 and TC-API-001). |

**Status:** ⚠️ N/A (UI prevents completing unassigned training; API vulnerability remains)

---

#### TC-010: Approve Completed Training

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-010 |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Training is in "completed" status, user acting as supervisor |
| **Test Data** | Employee: John Doe (EMP001), Training: Compliance Training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open employee's training modal | Training list loads with current assignments |
| 2 | Locate completed training | Status shows "completed" with 📋 Approve button |
| 3 | Click "Approve" button | Training status changes to "approved ✅" |
| 4 | Verify status updated | Status shows "approved ✅" |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-010-approve-training-result.png`

---

#### TC-011: Approve Uncompleted Training

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-011 |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Training is assigned but NOT completed (status "assigned") |
| **Note** | UI only shows the "Approve" button when status is "completed". For "assigned" status, only "Complete" button is shown. There is no UI path to approve uncompleted training. However, backend API allows it (see DEF-003 and TC-API-002). |

**Status:** ✅ PASS (UI correctly hides Approve button)
**Screenshot:** `screenshots/TC-011-approve-uncompleted-modal.png`

---

#### TC-012: Self-Approval Attempt

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-012 |
| **Requirement** | OJT-003 (security) |
| **Priority** | High |
| **Preconditions** | Employee is also a supervisor (can approve others' trainings) |
| **Test Data** | Employee: Jane Smith (EMP002), Training: Safety Training |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Assign training to self | Training assigned | ✅ Training assigned successfully |
| 2 | Complete the training | Training completed | ✅ Training completed |
| 3 | Click "Approve" on own completed training | Error: "Cannot approve your own training" | ❌ Self-approval succeeds — status changes to "approved" |

**Status:** ❌ FAIL
**Defect:** DEF-003
**Screenshot:** `screenshots/TC-012-employees-page.png`

---

### Section 5.3: Certification Management Tests (TC-013 - TC-016, TC-026 - TC-029)

---

#### TC-013: View Certifications List

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-013 |
| **Requirement** | CERT-001 |
| **Priority** | Medium |
| **Preconditions** | Database has seeded certifications |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Certifications page | Certification list loads with table |
| 2 | Verify certifications are displayed | List shows employee name, certification name, expiry date, days left |
| 3 | Verify "Check Expiring" and delete buttons are available | Action buttons visible |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-013-certification-page.png`

---

#### TC-014: Create Certification via Certifications Page

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-014 |
| **Requirement** | CERT-001 |
| **Priority** | High |
| **Preconditions** | User is on Certifications page |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to Certifications page | Certification list loads | ✅ Page loads |
| 2 | Look for "Add Certification" button | Button should exist to manually create certifications | ❌ No "Add Certification" button exists |
| 3 | Try to manually create a certification | Cannot create certification through this page | ❌ No UI mechanism available |

**Status:** ❌ FAIL
**Defect:** DEF-010
**Note:** The CertificationModal component exists but is not wired into the Certifications page. Certifications can only be created directly via API.

---

#### TC-015: Track Expiring Certifications (30 Days)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-015 |
| **Requirement** | CERT-003 |
| **Priority** | Medium |
| **Preconditions** | Certification with expiry date exactly 30 days from today exists in database |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to Certifications page | Certification list loads | ✅ List loads |
| 2 | Click "Check Expiring" button | Expiring certifications list appears | ✅ Button works |
| 3 | Look for 30-day expiry certification | Should appear in the list | ❌ Does NOT appear (off-by-one bug) |

**Status:** ❌ FAIL
**Defect:** DEF-004
**Screenshot:** `screenshots/TC-015-016-after-check-expiring.png`

---

#### TC-016: Track Expiring Certifications (Different Days)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-016 |
| **Requirement** | CERT-003 |
| **Priority** | Medium |
| **Preconditions** | Multiple certifications with different expiry dates exist (15, 30, 45, 60 days from now) |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to Certifications page | Certification list loads | ✅ List loads |
| 2 | Click "Check Expiring" button | Expiring list appears | ✅ Button works |
| 3 | Verify 15-day certification appears | Should appear | ✅ Appears |
| 4 | Verify 30-day certification appears | Should appear (<= 30 days) | ❌ Does NOT appear (off-by-one: uses < 30) |
| 5 | Verify 45-day certification does NOT appear | Should NOT appear | ✅ Does not appear |
| 6 | Verify 60-day certification does NOT appear | Should NOT appear | ✅ Does not appear |

**Status:** ❌ FAIL
**Defect:** DEF-004
**Screenshot:** `screenshots/TC-015-016-certifications-with-data.png`

---

#### TC-026: Training List Page Shows All Modules

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-026 |
| **Requirement** | GEN-005 |
| **Priority** | High |
| **Preconditions** | Database has 8 seeded training modules |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to /trainings | Page loads | ✅ Page loads |
| 2 | Look for training list | All 8 training modules should be displayed with details | ❌ Page is a stub — shows message "Go to Employees page to assign trainings" with no training list |

**Status:** ❌ FAIL
**Defect:** DEF-007
**Note:** The Trainings page is a stub/placeholder and does not render any training modules list.

---

#### TC-027: Certification Auto-Creation After Training Approval

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-027 |
| **Requirement** | CERT-001 |
| **Priority** | High |
| **Preconditions** | Employee has a training that can be completed and approved |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Assign training to employee | Training assigned | ✅ |
| 2 | Complete the training | Status changed to "completed" | ✅ |
| 3 | Approve the training | Status changed to "approved" | ✅ |
| 4 | Navigate to Certifications page | Certification list loads | ✅ |
| 5 | Look for certification for this employee/training | Certification should auto-appear | ❌ No certification was created |

**Status:** ❌ FAIL
**Defect:** DEF-008
**Note:** No certification is auto-created on approval, and there is no button or link on the training page to create a certification from an approved training.

---

#### TC-028: No Certification Creation Option After Training Approval

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-028 |
| **Requirement** | OJT-003 |
| **Priority** | Medium |
| **Preconditions** | Training is approved |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Complete full training workflow (assign → complete → approve) | Training approved | ✅ |
| 2 | Observe UI options on the approved training row | There should be a way to create a certification (auto-create on approval or a manual button) | ❌ Only "✅ Approved" text shown, no certification option |

**Status:** ❌ FAIL
**Defect:** DEF-009
**Screenshot:** `screenshots/TC-017-navigation-trainings.png`

---

#### TC-029: Approved Trainings Listed as Certifications

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-029 |
| **Requirement** | CERT-001 |
| **Priority** | High |
| **Preconditions** | Employee has an approved training |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Complete full training flow (assign → complete → approve) | Training approved | ✅ |
| 2 | Navigate to Certifications page | Certification list loads | ✅ |
| 3 | Look for the approved training in the certifications list | Approved training should appear as a certification | ❌ Approved training does not appear |

**Status:** ❌ FAIL
**Defect:** DEF-011
**Note:** The certifications list only shows records from the `certifications` table. Approved trainings are not automatically inserted into this table.

---

### Section 5.4: Dashboard Tests (TC-020 - TC-025)

---

#### TC-020: Dashboard Loads Successfully

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-020 |
| **Requirement** | GEN-004 |
| **Priority** | High |
| **Preconditions** | Backend and frontend are running, database has seed data |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open browser to `http://localhost:3000` | Dashboard loads |
| 2 | Verify page title shows "WorkForcePro" | Title displayed in header |
| 3 | Verify "Welcome to WorkForcePro" message | Message visible |
| 4 | Verify dashboard stats are visible | 4 stat cards load |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-020-dashboard-loads.png`

---

#### TC-021: Dashboard Displays Correct Employee Count

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-021 |
| **Requirement** | GEN-004 |
| **Priority** | High |
| **Preconditions** | Database has seeded employees (10) |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Employees" stat card | Card visible with count |
| 3 | Verify number matches actual employees | Should show correct count (10) |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-021-employee-count.png`

---

#### TC-022: Dashboard Displays Correct Training Count

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-022 |
| **Requirement** | GEN-004 |
| **Priority** | High |
| **Preconditions** | Database has seeded trainings (8) |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Trainings" stat card | Card visible with count |
| 3 | Verify number matches actual trainings | Should show correct count (8) |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-022-training-count.png`

---

#### TC-023: Dashboard Displays Correct Certification Count

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-023 |
| **Requirement** | GEN-004 |
| **Priority** | High |
| **Preconditions** | Database has seeded certifications (12) |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Certifications" stat card | Card visible with count |
| 3 | Verify number matches actual certifications | Should show correct count (12) |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-023-certification-count.png`

---

#### TC-024: Dashboard Displays Expiring Certifications Alert

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-024 |
| **Requirement** | GEN-004 |
| **Priority** | Medium |
| **Preconditions** | Database has certifications expiring within 30 days |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Expiring" stat card | Card visible with warning styling |
| 3 | Verify number shown | Should show count of expiring certifications |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-024-expiring-alert.png`

---

#### TC-025: Dashboard Stats Update After Data Change

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-025 |
| **Requirement** | GEN-004 |
| **Priority** | Medium |
| **Preconditions** | Dashboard is open |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Note current employee count | Record the number |
| 2 | Create a new employee via Employees page | Employee created successfully |
| 3 | Refresh or navigate back to Dashboard | Dashboard reloads with updated stats |
| 4 | Verify employee count increased by 1 | Count should increment |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-025-stats-update.png`

---

### Section 5.5: UI/UX Tests (TC-017 - TC-019)

---

#### TC-017: Navigation Menu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-017 |
| **Requirement** | GEN-001 |
| **Priority** | Medium |
| **Preconditions** | Application is running, user is on any page |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Dashboard" in sidebar | Dashboard page loads at `/` |
| 2 | Click "Employees" in sidebar | Employee list page loads at `/employees` |
| 3 | Click "Trainings" in sidebar | Training page loads at `/trainings` |
| 4 | Click "Certifications" in sidebar | Certification list loads at `/certifications` |
| 5 | Click "Reports" in sidebar | Reports page loads at `/reports` |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-017-navigation-employees.png`

---

#### TC-018: Page Refresh

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-018 |
| **Requirement** | GEN-002 |
| **Priority** | Low |
| **Preconditions** | Any page is loaded with data |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to any page (e.g., Employees) | Page loads correctly with data |
| 2 | Refresh browser (F5) | Page reloads without errors |
| 3 | Verify data persists | Data still visible after refresh |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-018-page-refresh.png`

---

#### TC-019: Modal Close

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-019 |
| **Requirement** | GEN-003 |
| **Priority** | Low |
| **Preconditions** | Any modal is open (e.g., Add Employee, Training) |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open any modal (e.g., Add Employee) | Modal opens with overlay |
| 2 | Click outside the modal (on overlay) | Modal closes |
| 3 | Re-open modal and click "X" (close) button | Modal closes |

**Status:** ✅ PASS
**Screenshot:** `screenshots/TC-019-modal-closed.png`

---

### Section 5.6: API Test Cases (TC-API-001 - TC-API-005)

---

#### TC-API-001: Complete Unassigned Training via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-001 |
| **Layer** | API |
| **Requirement** | OJT-004 |
| **Priority** | High |
| **Preconditions** | Employee exists, Training exists but NOT assigned |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Send POST request to `/api/trainings/complete` | | |
| 2 | Body: `{ "employee_id": 2, "training_id": 3, "completion_date": "2026-06-25", "notes": "Testing unassigned training completion" }` | | |
| 3 | Observe response | Error: "Training not assigned to this employee" (400) | ❌ Status 201, training created as "completed" with warning |

**Status:** ❌ FAIL
**Defect ID:** DEF-002

---

#### TC-API-002: Approve Uncompleted Training via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-002 |
| **Layer** | API |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Training is assigned but NOT completed |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Send POST request to `/api/trainings/approve` | | |
| 2 | Body: `{ "employee_id": 13, "training_id": 1, "supervisor_id": 1 }` | | |
| 3 | Observe response | Error: "Training must be completed first" (400) | ❌ Status 200, training approved without completion |

**Status:** ❌ FAIL
**Defect ID:** DEF-003

---

#### TC-API-003: Self-Approval via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-003 |
| **Layer** | API |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Employee is also a supervisor |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Send POST request to `/api/trainings/approve` | | |
| 2 | Body: `{ "employee_id": 1, "training_id": 2, "supervisor_id": 1 }` | | |
| 3 | Observe response | Error: "Cannot approve your own training" (400) | ❌ Status 200, self-approval succeeded |

**Status:** ❌ FAIL
**Defect ID:** DEF-003

---

#### TC-API-004: Duplicate Email via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-004 |
| **Layer** | API |
| **Requirement** | EMP-002 |
| **Priority** | High |
| **Preconditions** | Employee with email already exists |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Send POST request to `/api/employees` | | |
| 2 | Body: `{ "employee_id": "EMP888", "name": "Duplicate Email Test", "email": "apitester@workforcepro.com", "department_id": 1 }` | | |
| 3 | Observe response | Error: "Email already exists" with 400 status | ❌ Status 500, "Failed to create employee" |

**Status:** ❌ FAIL
**Defect ID:** DEF-001

---

#### TC-API-005: Duplicate Employee ID via API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-005 |
| **Layer** | API |
| **Requirement** | EMP-001 |
| **Priority** | High |
| **Preconditions** | Employee with that ID already exists |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Send POST request to `/api/employees` | | |
| 2 | Body: `{ "employee_id": "EMP001", "name": "Duplicate ID Test", "email": "duplicateid@test.com", "department_id": 1 }` | | |
| 3 | Observe response | Error: "Employee ID already exists" with 400 status | ❌ Status 500, "Failed to create employee" |

**Status:** ❌ FAIL
**Defect ID:** DEF-005

---

## 6.0 Test Execution Summary

| Category | Count |
|----------|-------|
| Total UI Test Cases | 31 |
| UI Passed | 19 |
| UI Failed | 9 |
| UI N/A | 3 |
| UI Pass Rate | 61% |
| Total API Test Cases | 5 |
| API Executed | 5 |
| API Passed | 0 |
| API Failed | 5 |
| API Pending | 0 |
| API Pass Rate | 0% |

### Pass/Fail Breakdown by Module

| Module | Total | Passed | Failed | N/A |
|--------|-------|--------|--------|-----|
| Employee Management | 5 | 3 | 2 | 0 |
| Training Management | 7 | 3 | 2 | 2 |
| Certification Management | 8 | 2 | 6 | 0 |
| Dashboard | 6 | 6 | 0 | 0 |
| UI/UX | 3 | 3 | 0 | 0 |
| Training List | 2 | 0 | 2 | 0 |
| End-to-End Workflow | 2 | 1 | 1 | 0 |
| **Total UI** | **31** | **19** | **9** | **3** |

### Defect Summary

| Severity | Count | Defect IDs |
|----------|-------|------------|
| Critical | 1 | DEF-002 |
| Major | 4 | DEF-007, DEF-008, DEF-010, DEF-011 |
| Security | 1 | DEF-003 |
| Medium | 1 | DEF-009 |
| Minor | 3 | DEF-001, DEF-004, DEF-006 |
| **Total** | **10** | |

---

## 7.0 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Testing environment not stable | Medium | High | Document environment setup, use localhost |
| Data integrity issues | High | High | Create backup of database before testing |
| Time constraints | Medium | Medium | Prioritize high-priority test cases |
| UI changes mid-testing | Medium | Medium | Document UI versions, retest affected areas |

---

## 8.0 Exit Criteria

Testing will be considered complete when:
- [x] All High priority test cases executed
- [ ] All Critical bugs fixed and verified (DEF-002 still open)
- [ ] All Major bugs fixed and verified (DEF-007, DEF-008, DEF-010, DEF-011 still open)
- [ ] All Security bugs fixed and verified (DEF-003 still open)
- [ ] Regression testing completed (pending bug fixes)
- [x] Test execution log complete
- [x] Test summary report generated
- [x] API test cases executed and documented