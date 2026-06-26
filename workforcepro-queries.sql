-- WorkForcePro - SQL Queries
-- =====================================================

-- 1. All employees and their departments

SELECT *
FROM employees
LEFT JOIN departments ON employees.department_id = departments.id
ORDER BY employees.name;

-- Result:
-- employee_id | name              | department       | is_supervisor
-- EMP001      | John Doe          | Engineering      | 0
-- EMP002      | Bob Wilson        | Human Resources  | 0
-- EMP003      | Alice Brown       | Finance          | 0
-- EMP004      | Charlie Davis     | Marketing        | 0
-- EMP005      | Diana Evans       | Operations       | 0
-- EMP006      | Frank Garcia      | Sales            | 0
-- EMP007      | Grace Harris      | IT Support       | 0
-- EMP008      | Henry Irving      | Legal            | 0
-- EMP009      | Iris Jackson      | Research & Dev   | 0
-- EMP010      | Jack Kelly        | Customer Support | 0
-- SUP001      | Jane Smith        | Engineering      | 1
-- SUP002      | Mike Johnson      | Human Resources  | 1
-- SUP003      | Sarah Williams    | Finance          | 1
-- SUP004      | David Brown       | Marketing        | 1
-- SUP005      | Emily Davis       | Operations       | 1

-- =====================================================

-- 2a. Employees who completed ALL assigned trainings

SELECT *
FROM employees
WHERE id NOT IN (
  SELECT employee_id
  FROM employee_trainings
  WHERE status IN ('assigned', 'rejected')
);

-- Result: 15 employees — all supervisors plus employees who
-- have no pending or rejected trainings (Alice Brown, Henry
-- Irving, Iris Jackson, Grace Harris, etc.)

-- =====================================================

-- 2b. Employees who completed AT LEAST ONE training

SELECT DISTINCT *
FROM employees, employee_trainings
WHERE employees.id = employee_trainings.employee_id
  AND employee_trainings.status = 'completed';

-- Result: 7 employees — Bob Wilson, Sarah Williams, Charlie
-- Davis, Henry Irving, Iris Jackson, John Doe, and one test entry.

-- =====================================================

-- 3. Count trainings per employee

SELECT employees.employee_id, employees.name, COUNT(*) AS training_count
FROM employees, employee_trainings
WHERE employees.id = employee_trainings.employee_id
GROUP BY employees.id
ORDER BY training_count DESC;

-- Result:
-- employee_id | name            | trainings
-- EMP002      | Bob Wilson      | 4
-- EMP001      | John Doe        | 2
-- EMP004      | Charlie Davis   | 2
-- SUP003      | Sarah Williams  | 2
-- 1555        | Subash Acharya  | 2
-- EMP003      | Alice Brown     | 1
-- EMP005      | Diana Evans     | 1
-- EMP006      | Frank Garcia    | 1
-- EMP007      | Grace Harris    | 1
-- EMP008      | Henry Irving    | 1
-- EMP009      | Iris Jackson    | 1
-- EMP010      | Jack Kelly      | 1
-- SUP001      | Jane Smith      | 1

-- =====================================================

-- 4. Certifications expiring within 30 days

-- Option A: returns ALL columns from both tables
SELECT *
FROM certifications, employees
WHERE certifications.employee_id = employees.id
  AND certifications.expiry_date BETWEEN date('now') AND date('now', '+30 days')
ORDER BY certifications.expiry_date;

-- Option B: keeps only certification columns + employee name
SELECT certifications.*, employees.name AS employee_name
FROM certifications, employees
WHERE certifications.employee_id = employees.id
  AND certifications.expiry_date BETWEEN date('now') AND date('now', '+30 days')
ORDER BY certifications.expiry_date;

-- Result (both options, as of June 26):
-- employee      | certification                     | expires    | days left
-- Diana Evans   | Google Analytics Certified        | 2026-07-24 | 27
-- Alice Brown   | SHRM Certified Professional       | 2026-07-24 | 27
-- Charlie Davis | Certified Public Accountant (CPA) | 2026-07-25 | 28
-- Henry Irving  | CompTIA Security+                 | 2026-07-26 | 29
-- Jack Kelly    | Certified Research Administrator  | 2026-07-26 | 29

-- =====================================================

-- 5. Employees with overdue trainings

-- Option A: returns ALL columns from all 3 tables
SELECT *
FROM employees, employee_trainings, trainings
WHERE employees.id = employee_trainings.employee_id
  AND employee_trainings.training_id = trainings.id
  AND employee_trainings.due_date < date('now')
  AND employee_trainings.status = 'assigned'
ORDER BY employee_trainings.due_date;

-- Option B: keeps only employee columns + training name + due date
SELECT employees.*, trainings.training_name, employee_trainings.due_date
FROM employees, employee_trainings, trainings
WHERE employees.id = employee_trainings.employee_id
  AND employee_trainings.training_id = trainings.id
  AND employee_trainings.due_date < date('now')
  AND employee_trainings.status = 'assigned'
ORDER BY employee_trainings.due_date;

-- Result: No overdue trainings found. All past-due assignments
-- have already been completed or approved.

-- =====================================================

-- 6. Top 5 employees by completed trainings

SELECT employees.employee_id, employees.name, COUNT(*) AS completed_trainings
FROM employees, employee_trainings
WHERE employees.id = employee_trainings.employee_id
  AND employee_trainings.status = 'completed'
GROUP BY employees.id
ORDER BY completed_trainings DESC
LIMIT 5;

-- Result:
-- employee_id | name           | completed
-- EMP002      | Bob Wilson     | 2
-- EMP001      | John Doe       | 1
-- EMP004      | Charlie Davis  | 1
-- EMP008      | Henry Irving   | 1
-- EMP009      | Iris Jackson   | 1
