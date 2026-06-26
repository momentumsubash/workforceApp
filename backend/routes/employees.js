const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { validateEmployee, checkDuplicateEmail, checkDuplicateEmployeeId } = require('../middleware/validation');

// ============================================================
// IMPORTANT: Specific routes MUST come before parameterized routes
// ============================================================

// GET /api/employees/supervisors - Get all supervisors
// This MUST come before /api/employees/:id
router.get('/supervisors', (req, res) => {
  db.all(`
    SELECT id, employee_id, name, email 
    FROM employees 
    WHERE is_supervisor = 1
    ORDER BY name
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching supervisors:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// GET /api/employees - Get all employees with department name and supervisor info
router.get('/', (req, res) => {
  db.all(`
    SELECT e.*, 
           d.name AS department_name,
           s.name AS supervisor_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees s ON e.supervisor_id = s.id
    ORDER BY e.name
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// GET /api/employees/:id - Get single employee with supervisor info
// This MUST come AFTER specific routes like /supervisors
router.get('/:id', (req, res) => {
  db.get(`
    SELECT e.*, 
           d.name AS department_name,
           s.name AS supervisor_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees s ON e.supervisor_id = s.id
    WHERE e.id = ?
  `, req.params.id, (err, row) => {
    if (err) {
      console.error('Error fetching employee:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(row);
  });
});

// GET /api/employees/:id/trainings - Get employee trainings
router.get('/:id/trainings', (req, res) => {
  db.all(`
    SELECT et.*, t.training_name
    FROM employee_trainings et
    JOIN trainings t ON et.training_id = t.id
    WHERE et.employee_id = ?
    ORDER BY et.created_at DESC
  `, req.params.id, (err, rows) => {
    if (err) {
      console.error('Error fetching employee trainings:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// GET /api/employees/:id/certifications - Get employee certifications
router.get('/:id/certifications', (req, res) => {
  db.all(`
    SELECT c.*
    FROM certifications c
    WHERE c.employee_id = ?
    ORDER BY c.expiry_date
  `, req.params.id, (err, rows) => {
    if (err) {
      console.error('Error fetching employee certifications:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// POST /api/employees - Create employee
router.post('/', validateEmployee, checkDuplicateEmail, checkDuplicateEmployeeId, (req, res) => {
  const { employee_id, name, email, department_id, supervisor_id, is_supervisor } = req.body;

  // If supervisor_id is provided, check if it exists
  if (supervisor_id) {
    db.get('SELECT id FROM employees WHERE id = ? AND is_supervisor = 1', [supervisor_id], (err, supervisor) => {
      if (err) {
        console.error('Error checking supervisor:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!supervisor) {
        return res.status(400).json({ error: 'Invalid supervisor. Supervisor must exist and have supervisor privileges.' });
      }
      createEmployee();
    });
  } else {
    createEmployee();
  }

  function createEmployee() {
    db.run(`
      INSERT INTO employees (employee_id, name, email, department_id, supervisor_id, is_supervisor)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [employee_id, name, email, department_id || null, supervisor_id || null, is_supervisor ? 1 : 0], function(err) {
      if (err) {
        console.error('Error creating employee:', err.message);
        return res.status(500).json({ error: 'Failed to create employee' });
      }

      db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (err2, row) => {
        if (err2) {
          console.error('Error fetching created employee:', err2.message);
          return res.status(500).json({ error: 'Failed to fetch employee' });
        }
        res.status(201).json(row);
      });
    });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', (req, res) => {
  const { name, email, department_id, supervisor_id, is_supervisor } = req.body;

  db.get('SELECT id FROM employees WHERE id = ?', [req.params.id], (err, employee) => {
    if (err) {
      console.error('Error checking employee:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.run(`
      UPDATE employees SET 
        name = ?, 
        email = ?, 
        department_id = ?, 
        supervisor_id = ?, 
        is_supervisor = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, email, department_id, supervisor_id, is_supervisor ? 1 : 0, req.params.id], function(err) {
      if (err) {
        console.error('Error updating employee:', err.message);
        return res.status(500).json({ error: 'Failed to update employee' });
      }

      db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err2, updated) => {
        if (err2) {
          console.error('Error fetching updated employee:', err2.message);
          return res.status(500).json({ error: 'Failed to fetch employee' });
        }
        res.json(updated);
      });
    });
  });
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM employees WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error('Error deleting employee:', err.message);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(204).send();
  });
});

module.exports = router;