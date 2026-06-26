const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/trainings - Get all available trainings
router.get('/', (req, res) => {
  db.all('SELECT * FROM trainings ORDER BY training_name', (err, rows) => {
    if (err) {
      console.error('Error fetching trainings:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// GET /api/trainings/employee/:employee_id - Get employee's trainings
router.get('/employee/:employee_id', (req, res) => {
  const { employee_id } = req.params;

  db.all(`
    SELECT et.*, t.training_name
    FROM employee_trainings et
    JOIN trainings t ON et.training_id = t.id
    WHERE et.employee_id = ?
    ORDER BY et.created_at DESC
  `, employee_id, (err, rows) => {
    if (err) {
      console.error('Error fetching employee trainings:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// POST /api/trainings/assign - Assign training to employee (Supervisor only)
router.post('/assign', (req, res) => {
  const { employee_id, training_id, due_date, supervisor_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!training_id) {
    return res.status(400).json({ error: 'Training ID is required' });
  }
  if (!supervisor_id) {
    return res.status(400).json({ error: 'Supervisor ID is required' });
  }

  // Check if supervisor exists and has supervisor privileges
  db.get('SELECT id FROM employees WHERE id = ? AND is_supervisor = 1', supervisor_id, (err, supervisor) => {
    if (err) {
      console.error('Error checking supervisor:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!supervisor) {
      return res.status(403).json({ error: 'Only supervisors can assign training' });
    }

    // Check if employee exists
    db.get('SELECT id FROM employees WHERE id = ?', employee_id, (err2, employee) => {
      if (err2) {
        console.error('Error checking employee:', err2.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Check if training exists
      db.get('SELECT id FROM trainings WHERE id = ?', training_id, (err3, training) => {
        if (err3) {
          console.error('Error checking training:', err3.message);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!training) {
          return res.status(404).json({ error: 'Training not found' });
        }

        // Check if already assigned
        db.get(`
          SELECT id FROM employee_trainings WHERE employee_id = ? AND training_id = ?
        `, [employee_id, training_id], (err4, existing) => {
          if (err4) {
            console.error('Error checking existing assignment:', err4.message);
            return res.status(500).json({ error: 'Database error' });
          }
          if (existing) {
            return res.status(400).json({ error: 'Training already assigned to this employee' });
          }

          const dueDate = due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          db.run(`
            INSERT INTO employee_trainings (employee_id, training_id, due_date, status)
            VALUES (?, ?, ?, 'assigned')
          `, [employee_id, training_id, dueDate], function(err5) {
            if (err5) {
              console.error('Error assigning training:', err5.message);
              return res.status(500).json({ error: 'Failed to assign training' });
            }

            db.get(`
              SELECT et.*, t.training_name
              FROM employee_trainings et
              JOIN trainings t ON et.training_id = t.id
              WHERE et.id = ?
            `, this.lastID, (err6, record) => {
              if (err6) {
                console.error('Error fetching assignment:', err6.message);
                return res.status(500).json({ error: 'Failed to fetch assignment' });
              }
              res.status(201).json(record);
            });
          });
        });
      });
    });
  });
});

// POST /api/trainings/complete - Mark training as completed
router.post('/complete', (req, res) => {
  const { employee_id, training_id, completion_date, notes } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!training_id) {
    return res.status(400).json({ error: 'Training ID is required' });
  }

  db.get(`
    SELECT et.*, t.training_name
    FROM employee_trainings et
    JOIN trainings t ON et.training_id = t.id
    WHERE et.training_id = ? AND et.employee_id = ?
  `, [training_id, employee_id], (err, record) => {
    if (err) {
      console.error('Error checking training assignment:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    // BUG DEF-002: If not assigned, still allow completion (intentional bug)
    if (!record) {
      const compDate = completion_date || new Date().toISOString().split('T')[0];
      const noteText = notes || 'Completed without assignment';

      db.run(`
        INSERT INTO employee_trainings (employee_id, training_id, status, completion_date, notes)
        VALUES (?, ?, 'completed', ?, ?)
      `, [employee_id, training_id, compDate, noteText], function(err2) {
        if (err2) {
          console.error('Error completing unassigned training:', err2.message);
          return res.status(500).json({ error: 'Failed to complete training' });
        }

        db.get(`
          SELECT et.*, t.training_name
          FROM employee_trainings et
          JOIN trainings t ON et.training_id = t.id
          WHERE et.id = ?
        `, this.lastID, (err3, newRecord) => {
          if (err3) {
            console.error('Error fetching completed training:', err3.message);
            return res.status(500).json({ error: 'Failed to fetch training' });
          }
          return res.status(201).json({
            ...newRecord,
            warning: 'Training was not assigned but was completed anyway'
          });
        });
      });
      return;
    }

    const compDate = completion_date || new Date().toISOString().split('T')[0];
    db.run(`
      UPDATE employee_trainings SET status = 'completed', completion_date = ?, notes = ?
      WHERE id = ?
    `, [compDate, notes || null, record.id], function(err2) {
      if (err2) {
        console.error('Error updating training completion:', err2.message);
        return res.status(500).json({ error: 'Failed to complete training' });
      }

      db.get(`
        SELECT et.*, t.training_name
        FROM employee_trainings et
        JOIN trainings t ON et.training_id = t.id
        WHERE et.id = ?
      `, record.id, (err3, updated) => {
        if (err3) {
          console.error('Error fetching updated training:', err3.message);
          return res.status(500).json({ error: 'Failed to fetch training' });
        }
        res.json(updated);
      });
    });
  });
});

// POST /api/trainings/approve - Approve training (Supervisor only)
router.post('/approve', (req, res) => {
  const { employee_id, training_id, supervisor_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!training_id) {
    return res.status(400).json({ error: 'Training ID is required' });
  }
  if (!supervisor_id) {
    return res.status(400).json({ error: 'Supervisor ID is required' });
  }

  // Check if supervisor exists and has supervisor privileges
  db.get('SELECT id FROM employees WHERE id = ? AND is_supervisor = 1', supervisor_id, (err, supervisor) => {
    if (err) {
      console.error('Error checking supervisor:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!supervisor) {
      return res.status(403).json({ error: 'Only supervisors can approve training' });
    }

    db.get(`
      SELECT et.*, t.training_name
      FROM employee_trainings et
      JOIN trainings t ON et.training_id = t.id
      WHERE et.training_id = ? AND et.employee_id = ?
    `, [training_id, employee_id], (err2, record) => {
      if (err2) {
        console.error('Error fetching training record:', err2.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!record) {
        return res.status(400).json({ error: 'Training record not found' });
      }

      // BUG DEF-003: No self-approval check
      // Should check: if (supervisor_id === employee_id) return error

      // BUG DEF-003: No completion check
      // Should check: if (record.status !== 'completed') return error

      db.run("UPDATE employee_trainings SET status = 'approved' WHERE id = ?", record.id, function(err3) {
        if (err3) {
          console.error('Error approving training:', err3.message);
          return res.status(500).json({ error: 'Failed to approve training' });
        }

        db.get(`
          SELECT et.*, t.training_name
          FROM employee_trainings et
          JOIN trainings t ON et.training_id = t.id
          WHERE et.id = ?
        `, record.id, (err4, updated) => {
          if (err4) {
            console.error('Error fetching approved training:', err4.message);
            return res.status(500).json({ error: 'Failed to fetch training' });
          }
          res.json(updated);
        });
      });
    });
  });
});

// POST /api/trainings/reject - Reject training (Supervisor only)
router.post('/reject', (req, res) => {
  const { employee_id, training_id, supervisor_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!training_id) {
    return res.status(400).json({ error: 'Training ID is required' });
  }
  if (!supervisor_id) {
    return res.status(400).json({ error: 'Supervisor ID is required' });
  }

  db.get('SELECT id FROM employees WHERE id = ? AND is_supervisor = 1', supervisor_id, (err, supervisor) => {
    if (err) {
      console.error('Error checking supervisor:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!supervisor) {
      return res.status(403).json({ error: 'Only supervisors can reject training' });
    }

    db.get(`
      SELECT et.*, t.training_name
      FROM employee_trainings et
      JOIN trainings t ON et.training_id = t.id
      WHERE et.training_id = ? AND et.employee_id = ?
    `, [training_id, employee_id], (err2, record) => {
      if (err2) {
        console.error('Error fetching training record:', err2.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!record) {
        return res.status(400).json({ error: 'Training record not found' });
      }

      db.run("UPDATE employee_trainings SET status = 'rejected' WHERE id = ?", record.id, function(err3) {
        if (err3) {
          console.error('Error rejecting training:', err3.message);
          return res.status(500).json({ error: 'Failed to reject training' });
        }
        res.json({ message: 'Training rejected' });
      });
    });
  });
});

// GET /api/trainings/:id - Get single training
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM trainings WHERE id = ?', req.params.id, (err, row) => {
    if (err) {
      console.error('Error fetching training:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.json(row);
  });
});

// GET /api/trainings/:id/assignments - Get all assignments for a training
router.get('/:id/assignments', (req, res) => {
  db.all(`
    SELECT et.*, e.name AS employee_name
    FROM employee_trainings et
    JOIN employees e ON et.employee_id = e.id
    WHERE et.training_id = ?
    ORDER BY et.created_at DESC
  `, req.params.id, (err, rows) => {
    if (err) {
      console.error('Error fetching training assignments:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

module.exports = router;