# WorkForcePro – UI Test Cases

## Test Case Execution Summary

| Category | Count |
|----------|-------|
| Total UI Test Cases | 31 |
| Passed | 19 |
| Failed | 7 |
| N/A | 3 |
| Pending | 2 |
| Pass Rate | 61% |

---

## Detailed Test Cases

### TC-001: Create Employee with Valid Data

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-001 |
| **Title** | Create Employee with Valid Data |
| **Requirement** | EMP-001, EMP-003 |
| **Priority** | High |
| **Preconditions** | User is logged in as Supervisor, on Employees page |
| **Test Data** | Employee ID: "EMP999", Name: "Test User QA", Email: "testqa@workforcepro.com", Department: "Engineering", Supervisor: "John Doe" |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Employee" button | Modal opens with form |
| 2 | Enter Employee ID "EMP999" | Field accepts input |
| 3 | Enter Name "Test User QA" | Field accepts input |
| 4 | Enter Email "testqa@workforcepro.com" | Field accepts input |
| 5 | Select Department "Engineering" | Department selected |
| 6 | Select Supervisor "John Doe" | Supervisor selected |
| 7 | Click "Create Employee" | Employee created successfully |
| 8 | Verify employee appears in list | Employee visible in list |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/T9CnuO5)

---

### TC-002: Create Employee with Missing Required Fields

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-002 |
| **Title** | Create Employee with Missing Required Fields |
| **Requirement** | EMP-001 |
| **Priority** | High |
| **Preconditions** | User is on Employees page |
| **Test Data** | All fields left blank |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Employee" button | Modal opens |
| 2 | Leave Employee ID blank | Field is empty |
| 3 | Leave Name blank | Field is empty |
| 4 | Leave Email blank | Field is empty |
| 5 | Click "Create Employee" | HTML5 validation prevents submission |
| 6 | Verify employee not created | Employee does NOT appear in list |

**Status:** ✅ PASS
**Defect ID:** -
**Note:** UI updated with HTML5 validation. Users cannot submit form with empty required fields.
**Screenshot:** [Screenshot 1](https://imgur.com/XwR9w3O) [Screenshot 2](https://imgur.com/VLcUw1H)

---

### TC-003: Create Employee with Duplicate Email

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-003 |
| **Title** | Create Employee with Duplicate Email |
| **Requirement** | EMP-002 |
| **Priority** | High |
| **Preconditions** | Employee with email "momentum.acharya@gmail.com" exists |
| **Test Data** | Employee ID: "1555", Name: "Duplicate Test", Email: "momentum.acharya@gmail.com" (DUPLICATE) |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Click "Add Employee" button | Modal opens | ✅ Modal opens |
| 2 | Fill all fields with existing email | Form accepts data | ✅ Form accepts data |
| 3 | Click "Create Employee" | Error: "Email must be unique" | ❌ 500 Internal Server Error |
| 4 | Verify employee not created | Employee does NOT appear | ❌ Employee not created but UI shows generic error |

**Status:** ❌ FAIL
**Defect ID:** DEF-001, DEF-006
**Screenshot:** [Screenshot](https://imgur.com/2c08qui)

---

### TC-004: Create Employee with Unique Email (Positive)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-004 |
| **Title** | Create Employee with Unique Email (Positive) |
| **Requirement** | EMP-002 |
| **Priority** | High |
| **Preconditions** | User is on Employees page |
| **Test Data** | Employee ID: "1555", Name: "Unique Test", Email: "info@diyana.com" |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Employee" button | Modal opens |
| 2 | Fill all fields with unique email | Form accepts data |
| 3 | Click "Create Employee" | Employee created successfully |
| 4 | Verify employee appears in list | New employee visible |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/WX3TijD)

---

### TC-005: Create Employee with Duplicate Employee ID

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-005 |
| **Title** | Create Employee with Duplicate Employee ID |
| **Requirement** | EMP-001 |
| **Priority** | High |
| **Preconditions** | Employee with ID "EMP001" exists |
| **Test Data** | Employee ID: "EMP001" (DUPLICATE), Name: "Duplicate ID Test", Email: "duplicateid@test.com" |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Click "Add Employee" button | Modal opens | ✅ Modal opens |
| 2 | Enter duplicate Employee ID "EMP001" | Field accepts input | ✅ Field accepts input |
| 3 | Fill remaining fields | Form accepts data | ✅ Form accepts data |
| 4 | Click "Create Employee" | Error: "Employee ID must be unique" | ✅ Error: "Employee ID must be unique" |
| 5 | Verify employee not created | Employee does NOT appear | ✅ Employee NOT created |

**Status:** ✅ PASS
**Defect ID:** - (Fixed)
**Screenshot:** [Screenshot](https://imgur.com/YPzmnpa)

---

### TC-006: Assign Training to Employee (via Training Page)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-006 |
| **Title** | Assign Training to Employee |
| **Requirement** | OJT-001 |
| **Priority** | High |
| **Preconditions** | User is logged in as Supervisor, Employee exists, Training module exists |
| **Test Data** | Employee: John Doe (EMP001), Training: Safety Training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Training page | Training page loads with employee selector |
| 2 | Select an employee from dropdown | Employee selected, current trainings displayed |
| 3 | Select "Safety Training" from "Assign New Training" dropdown | Training selected |
| 4 | Click "Assign" button | Training appears in Current Trainings table with status "assigned" |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/1B4TDgF)

---

### TC-007: Assign Training Without Selecting Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-007 |
| **Title** | Assign Training Without Selecting Employee |
| **Requirement** | OJT-001 |
| **Priority** | Medium |
| **Preconditions** | User is on Training page |
| **Test Data** | N/A |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Attempt to assign training without selecting employee | Should prompt to select employee first | UI updated: Training can only be assigned after selecting an employee |

**Status:** ⚠️ N/A
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/yDNvznP)

---

### TC-008: Complete Assigned Training (Employee Action)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-008 |
| **Title** | Complete Assigned Training |
| **Requirement** | OJT-002 |
| **Priority** | High |
| **Preconditions** | Employee has assigned training with status "assigned" |
| **Test Data** | Employee: Jane Smith (EMP002), Training: Safety Training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Employee (Jane Smith) | Dashboard loads with employee role |
| 2 | Navigate to Training page | Training list loads |
| 3 | Locate assigned training in Current Trainings table | Status shows "assigned" with ✅ Complete button |
| 4 | Click "Complete" button | Training status changes to "completed" |
| 5 | Verify status updated | Status shows "completed" with Approve button (visible to supervisor) |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/YDicFDN)

---

### TC-009: Complete Unassigned Training (UI Prevention)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-009 |
| **Title** | Complete Unassigned Training |
| **Requirement** | OJT-004 |
| **Priority** | High |
| **Preconditions** | Employee exists, Training exists but NOT assigned |
| **Note** | UI only lists assigned trainings in the Current Trainings table. There is no UI path to complete an unassigned training. However, backend API still allows it (see DEF-002 and TC-API-001). |

**Status:** ⚠️ N/A (UI prevents completing unassigned training; API vulnerability remains)
**Defect ID:** DEF-002 (API only)
**Screenshot:** [Screenshot](https://imgur.com/YDicFDN)

---

### TC-010: Approve Completed Training (Supervisor Action)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-010 |
| **Title** | Approve Completed Training |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Training is in "completed" status, user is Supervisor |
| **Test Data** | Employee: John Doe (EMP001), Training: Compliance Training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Supervisor | Dashboard loads with supervisor role |
| 2 | Navigate to Training page | Training page loads |
| 3 | Select employee from dropdown | Current trainings displayed |
| 4 | Locate completed training | Status shows "completed" with 📋 Approve button |
| 5 | Click "Approve" button | Training status changes to "approved ✅" |
| 6 | Verify status updated | Status shows "approved ✅" |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/sfuatE4)

---

### TC-011: Approve Uncompleted Training (UI Prevention)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-011 |
| **Title** | Approve Uncompleted Training |
| **Requirement** | OJT-003 |
| **Priority** | High |
| **Preconditions** | Training is assigned but NOT completed (status "assigned") |
| **Note** | UI only shows the "Approve" button when status is "completed". For "assigned" status, only "Complete" button is shown. There is no UI path to approve uncompleted training. However, backend API allows it (see DEF-003 and TC-API-002). |

**Status:** ✅ PASS (UI correctly hides Approve button)
**Defect ID:** DEF-003 (API only)
**Screenshot:** [Screenshot](https://imgur.com/RJZKKXT)

---

### TC-012: Self-Approval Attempt (UI Prevention)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-012 |
| **Title** | Self-Approval Attempt |
| **Requirement** | OJT-003 (security) |
| **Priority** | High |
| **Preconditions** | Employee is also a supervisor (can approve others' trainings) |
| **Test Data** | Employee: Jane Smith (EMP002), Training: Safety Training |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Login as Supervisor (Jane Smith) | Dashboard loads | ✅ Dashboard loads |
| 2 | Assign training to self | Training assigned | ✅ Training assigned |
| 3 | Complete the training | Training completed | ✅ Training completed |
| 4 | Click "Approve" on own completed training | Error: "Cannot approve your own training" | ✅ UI correctly hides "Approve" button after approval |

**Status:** ✅ PASS
**Defect ID:** DEF-003 (API only - vulnerability remains in backend)
**Screenshot:** [Screenshot](https://imgur.com/jOQY8cF)

---

### TC-013: View Certifications List

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-013 |
| **Title** | View Certifications List |
| **Requirement** | CERT-001 |
| **Priority** | Medium |
| **Preconditions** | Database has seeded certifications |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Certifications page | Certification list loads |
| 2 | Verify certifications are displayed | List shows existing certifications |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/JjVL9AW)

---

### TC-014: Create Certification via UI

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-014 |
| **Title** | Create Certification via UI |
| **Requirement** | CERT-001 |
| **Priority** | High |
| **Preconditions** | User is on Certifications page |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to Certifications page | Certification list loads | ✅ |
| 2 | Look for "Add Certification" button | Button should exist | ❌ No button found |
| 3 | Try to create certification | Certification created | ❌ Cannot create |

**Status:** ❌ FAIL
**Defect ID:** DEF-010
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-015: Track Expiring Certifications (30 Days)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-015 |
| **Title** | Track Expiring Certifications (30 Days) |
| **Requirement** | CERT-003 |
| **Priority** | Medium |
| **Preconditions** | Certification with expiry date 30 days from today exists |
| **Test Data** | Employee: Alice Brown (EMP004), Certification: Certified Public Accountant (CPA), Expiry: Today + 30 days |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to Certifications page | Certification list loads | ✅ |
| 2 | Click "Check Expiring" button | Expiring list appears | ✅ |
| 3 | Look for 30-day certification | Should appear in list | ❌ Does NOT appear |

**Status:** ❌ FAIL
**Defect ID:** DEF-004
**Screenshot:** [Screenshot 1](https://imgur.com/qV4Cyqt) [Screenshot 2](https://imgur.com/JjVL9AW)

---

### TC-016: Track Expiring Certifications (Different Days)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-016 |
| **Title** | Track Expiring Certifications (Different Days) |
| **Requirement** | CERT-003 |
| **Priority** | Medium |
| **Preconditions** | Multiple certifications with different expiry dates exist (29, 30, 31, 60, 90 days from now) |
| **Test Data** | 29 days, 30 days, 31 days, 60 days, 90 days |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to Certifications page | All certifications displayed with correct days left | ✅ All certifications displayed correctly |
| 2 | Click "Check Expiring" button | Expiring list should show certifications with ≤ 30 days | ❌ Only shows certifications with < 30 days |
| 3 | Verify 29-day certification appears | Should appear | ✅ Appears |
| 4 | Verify 30-day certification appears | Should appear (≤ 30 days) | ❌ Does NOT appear (off-by-one bug) |
| 5 | Verify 31-day certification does NOT appear | Should NOT appear | ✅ Does NOT appear |
| 6 | Verify 60-day certification does NOT appear | Should NOT appear | ✅ Does NOT appear |
| 7 | Verify 90-day certification does NOT appear | Should NOT appear | ✅ Does NOT appear |

**Status:** ❌ FAIL
**Defect ID:** DEF-004
**Note:** The "Check Expiring" button excludes certifications expiring exactly at 30 days. Only certifications with 29 days or fewer appear. The main Certifications page correctly displays all certifications with accurate "Days Left" counts (including 30 days).
**Screenshot:** `screenshots/TC-016-after-check-expiring.png`

---

### TC-017: Navigation Menu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-017 |
| **Title** | Navigation Menu |
| **Requirement** | General |
| **Priority** | Medium |
| **Preconditions** | User is logged in |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Dashboard" | Dashboard loads |
| 2 | Click "Employees" | Employee list loads |
| 3 | Click "Trainings" | Training page loads |
| 4 | Click "Certifications" | Certification list loads |
| 5 | Click "Reports" | Reports page loads (Supervisor only) |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-018: Page Refresh

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-018 |
| **Title** | Page Refresh |
| **Requirement** | General |
| **Priority** | Low |
| **Preconditions** | Any page is loaded |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to any page | Page loads correctly |
| 2 | Refresh browser (F5) | Page reloads without errors |
| 3 | Verify data persists | Data still visible |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-019: Modal Close

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-019 |
| **Title** | Modal Close |
| **Requirement** | General |
| **Priority** | Low |
| **Preconditions** | Any modal is open |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open any modal | Modal opens |
| 2 | Click outside modal | Modal closes |
| 3 | Click "X" button | Modal closes |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/mfv5kWn)

---

### TC-020: Dashboard Loads Successfully

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-020 |
| **Title** | Dashboard Loads Successfully |
| **Requirement** | General |
| **Priority** | High |
| **Preconditions** | Backend and frontend are running |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open browser to `http://localhost:3000` | Dashboard loads |
| 2 | Verify "Welcome to WorkForcePro" message | Message visible |
| 3 | Verify dashboard stats are visible | Stats cards load |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/S5ChFiZ)

---

### TC-021: Dashboard Displays Correct Employee Count

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-021 |
| **Title** | Dashboard Displays Correct Employee Count |
| **Requirement** | General |
| **Priority** | High |
| **Preconditions** | Database has seeded employees |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Employees" stat card | Card visible |
| 3 | Verify number matches database | Employee count matches database |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/S5ChFiZ)

---

### TC-022: Dashboard Displays Correct Training Count

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-022 |
| **Title** | Dashboard Displays Correct Training Count |
| **Requirement** | General |
| **Priority** | High |
| **Preconditions** | Database has seeded trainings |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Trainings" stat card | Card visible |
| 3 | Verify number matches database | Training count matches database |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/S5ChFiZ)

---

### TC-023: Dashboard Displays Correct Certification Count

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-023 |
| **Title** | Dashboard Displays Correct Certification Count |
| **Requirement** | General |
| **Priority** | High |
| **Preconditions** | Database has seeded certifications |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Certifications" stat card | Card visible |
| 3 | Verify number matches database | Certification count matches database |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/S5ChFiZ)

---

### TC-024: Dashboard Displays Expiring Certifications Alert

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-024 |
| **Title** | Dashboard Displays Expiring Certifications Alert |
| **Requirement** | General |
| **Priority** | Medium |
| **Preconditions** | Database has certifications expiring within 30 days |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to Dashboard | Dashboard loads |
| 2 | Locate "Expiring" stat card | Card visible |
| 3 | Verify number shown | Expiring certifications shown in alert card |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot](https://imgur.com/S5ChFiZ)

---

### TC-025: Dashboard Stats Update After Data Change

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-025 |
| **Title** | Dashboard Stats Update After Data Change |
| **Requirement** | General |
| **Priority** | Medium |
| **Preconditions** | Dashboard is open |
| **Test Data** | N/A |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Note current employee count | Record number |
| 2 | Create a new employee | Employee created |
| 3 | Refresh Dashboard | Dashboard refreshes |
| 4 | Verify count increased by 1 | Employee count should increase by 1 |

**Status:** ✅ PASS
**Defect ID:** -
**Screenshot:** [Screenshot 1](https://imgur.com/S5ChFiZ) [Screenshot 2](https://imgur.com/XAlXWMc)

---

### TC-026: View All Trainings in Training List

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-026 |
| **Title** | View All Trainings in Training List |
| **Requirement** | General |
| **Priority** | High |
| **Preconditions** | Trainings exist in database |
| **Test Data** | N/A |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Navigate to `/trainings` | Page loads | ✅ Page loads |
| 2 | Observe the training list | All training modules visible | ❌ Page is a stub — shows message "Go to Employees page to assign trainings" with no training list |

**Status:** ❌ FAIL
**Defect ID:** DEF-007
**Screenshot:** [Screenshot](https://imgur.com/qsXT6hy)

---

### TC-027: Certification Auto-Creation After Training Approval

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-027 |
| **Title** | Certification Auto-Creation After Training Approval |
| **Requirement** | CERT-001 |
| **Priority** | High |
| **Preconditions** | Employee has approved training |
| **Test Data** | Employee: John Doe, Training: Safety Training (approved) |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Complete full training workflow | Training completed and approved | ✅ |
| 2 | Approve training | Training status "approved" | ✅ |
| 3 | Navigate to Certifications page | Certification list loads | ✅ |
| 4 | Look for certification | Certification appears in list | ❌ No certification created |

**Status:** ❌ FAIL
**Defect ID:** DEF-008
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-028: No Certification Creation Option After Training Approval

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-028 |
| **Title** | No Certification Creation Option After Training Approval |
| **Requirement** | OJT-003 |
| **Priority** | Medium |
| **Preconditions** | Training is approved |
| **Test Data** | Employee: John Doe, Training: Safety Training (approved) |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Complete full training workflow (assign → complete → approve) | Training approved | ✅ |
| 2 | Look for any certification option on the approved training row | A button/link to create certification should be present, or certification should auto-create | ❌ Only "✅ Approved" text shown, no certification option |

**Status:** ❌ FAIL
**Defect ID:** DEF-009
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-029: Approved Trainings Not Listed in Certifications

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-029 |
| **Title** | Approved Trainings Not Listed in Certifications |
| **Requirement** | CERT-001 |
| **Priority** | High |
| **Preconditions** | Employee has approved training |
| **Test Data** | Employee: John Doe, Training: Safety Training (approved) |

| Step | Action | Expected Result | Actual Result |
|------|--------|-----------------|---------------|
| 1 | Complete full training workflow | Training completed and approved | ✅ |
| 2 | Approve training | Training status "approved" | ✅ |
| 3 | Navigate to Certifications page | Certification list loads | ✅ |
| 4 | Look for approved training in list | Should appear as certification | ❌ Approved trainings not listed |

**Status:** ❌ FAIL
**Defect ID:** DEF-011
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-030: Login as Employee and Complete Full Training Workflow

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-030 |
| **Title** | Login as Employee and Complete Full Training Workflow |
| **Requirement** | OJT-001, OJT-002, OJT-003, CERT-001 |
| **Priority** | High |
| **Preconditions** | Employee account exists with assigned training |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to login page | Login page loads |
| 2 | Enter employee email (e.g., `john.doe@workforcepro.com`) | Email accepted |
| 3 | Enter password (any) | Password accepted |
| 4 | Click "Login" | Redirected to Dashboard |
| 5 | Verify dashboard shows employee welcome message | "Welcome, John Doe!" with "Employee" role badge |
| 6 | Navigate to "Trainings" page | Training page loads |
| 7 | Select employee from dropdown (auto-selected if logged in) | Shows assigned trainings |
| 8 | Click "Complete" on assigned training | Training status changes to "completed" |
| 9 | Verify status updated | Status shows "completed" |
| 10 | Logout and login as supervisor | Supervisor dashboard loads |
| 11 | Navigate to Training page | Training page loads |
| 12 | Select the same employee | Training shows as "completed" |
| 13 | Click "Approve" | Training status changes to "approved" |
| 14 | Navigate to Certifications page | Certification list loads |
| 15 | Verify certification is created | ❌ Certification for the training does NOT appear (BUG) |

**Status:** ❌ FAIL (Expected: DEF-008, DEF-009, DEF-011)
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

### TC-031: Login as Supervisor and Manage Trainings

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-031 |
| **Title** | Login as Supervisor and Manage Trainings |
| **Requirement** | OJT-001, OJT-003, CERT-001 |
| **Priority** | High |
| **Preconditions** | Supervisor account exists, Employees exist |

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to login page | Login page loads |
| 2 | Enter supervisor email (e.g., `jane.smith@workforcepro.com`) | Email accepted |
| 3 | Enter password (any) | Password accepted |
| 4 | Click "Login" | Redirected to Dashboard |
| 5 | Verify dashboard shows supervisor welcome message | "Welcome, Jane Smith!" with "Supervisor" role badge |
| 6 | Verify "Employees" and "Reports" menu items are visible | Both menu items appear in sidebar |
| 7 | Navigate to "Employees" page | Employee list loads |
| 8 | Click on an employee | Can view employee details |
| 9 | Navigate to "Trainings" page | Training page loads |
| 10 | Select an employee from dropdown | Employee trainings displayed |
| 11 | Assign a new training from dropdown | Training appears with status "assigned" |
| 12 | Navigate to "Certifications" page | Certification list loads |
| 13 | Click "Check Expiring" button | Expiring certifications list appears (may have off-by-one bug) |
| 14 | Navigate to "Reports" page | Reports page loads |

**Status:** ⬜ Pending
**Defect ID:** (Expected: DEF-003, DEF-004, DEF-007)
**Screenshot:** [Screenshot](https://imgur.com/bd0Q4hb)

---

## UI Defect Summary

| Defect ID | Title | Severity | Priority | Status | Test Cases Affected |
|-----------|-------|----------|----------|--------|---------------------|
| DEF-001 | Duplicate Email - Poor Error Handling (500 instead of 400) | Minor | Medium | Open | TC-003 |
| DEF-003 | Self-Approval Allowed (API only - UI fixed) | Security | High | Open | TC-012 |
| DEF-004 | Expiration Alert Off by 1 Day (30-Day Exclusion) | Minor | Medium | Open | TC-015, TC-016 |
| DEF-006 | Frontend Shows Generic Error for Duplicate Email | Minor | Low | Open | TC-003 |
| DEF-007 | Training List Page Not Showing All Trainings | Major | High | Open | TC-026 |
| DEF-008 | Certification Not Created After Training Approval | Major | High | Open | TC-027, TC-030 |
| DEF-009 | No Certification Option After Training Approval | Medium | Medium | Open | TC-028, TC-030 |
| DEF-010 | No UI Option to Create Certification Manually | Major | High | Open | TC-014 |
| DEF-011 | Approved Trainings Not Listed in Certifications | Major | High | Open | TC-029, TC-030 |

---

## Detailed Test Cases

Full test cases are available in [01-test-plan.md](01-test-plan.md)