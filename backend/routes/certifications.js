const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { validateCertification } = require('../middleware/validation');

// GET /api/certifications - Get all certifications
router.get('/', (req, res) => {
  db.all(`
    SELECT c.*, e.name AS employee_name
    FROM certifications c
    JOIN employees e ON c.employee_id = e.id
    ORDER BY c.expiry_date
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching certifications:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// GET /api/certifications/expiring - Get expiring certifications
// BUG DEF-004: Off-by-one error in date calculation
router.get('/expiring', (req, res) => {
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

  const todayStr = today.toISOString().split('T')[0];
  const thirtyDaysStr = thirtyDaysLater.toISOString().split('T')[0];

  db.all(`
    SELECT c.*, e.name AS employee_name,
           CAST(julianday(c.expiry_date) - julianday(?) AS INTEGER) AS days_remaining
    FROM certifications c
    JOIN employees e ON c.employee_id = e.id
    WHERE c.expiry_date BETWEEN ? AND ?
      AND CAST(julianday(c.expiry_date) - julianday(?) AS INTEGER) < 30
    ORDER BY c.expiry_date
  `, [todayStr, todayStr, thirtyDaysStr, todayStr], (err, rows) => {
    if (err) {
      console.error('Error fetching expiring certifications:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    const expiring = rows || [];

    // BUG: If nothing expiring, returns everything (leakage bug)
    if (expiring.length === 0) {
      db.all(`
        SELECT c.*, e.name AS employee_name
        FROM certifications c
        JOIN employees e ON c.employee_id = e.id
        ORDER BY c.expiry_date
      `, (err2, allRows) => {
        if (err2) {
          console.error('Error fetching all certifications:', err2.message);
          return res.status(500).json({ error: 'Database error' });
        }
        return res.json(allRows || []);
      });
      return;
    }

    res.json(expiring);
  });
});

// GET /api/certifications/employee/:employee_id - Get employee certifications
router.get('/employee/:employee_id', (req, res) => {
  db.all(`
    SELECT c.*, e.name AS employee_name
    FROM certifications c
    JOIN employees e ON c.employee_id = e.id
    WHERE c.employee_id = ?
    ORDER BY c.expiry_date
  `, req.params.employee_id, (err, rows) => {
    if (err) {
      console.error('Error fetching employee certifications:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows || []);
  });
});

// GET /api/certifications/:id - Get single certification
router.get('/:id', (req, res) => {
  db.get(`
    SELECT c.*, e.name AS employee_name
    FROM certifications c
    JOIN employees e ON c.employee_id = e.id
    WHERE c.id = ?
  `, req.params.id, (err, row) => {
    if (err) {
      console.error('Error fetching certification:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json(row);
  });
});

// POST /api/certifications - Assign certification
router.post('/', validateCertification, (req, res) => {
  const { employee_id, certification_name, expiry_date } = req.body;

  db.get('SELECT id FROM employees WHERE id = ?', employee_id, (err, employee) => {
    if (err) {
      console.error('Error checking employee:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.run(`
      INSERT INTO certifications (employee_id, certification_name, expiry_date)
      VALUES (?, ?, ?)
    `, [employee_id, certification_name, expiry_date], function(err) {
      if (err) {
        console.error('Error creating certification:', err.message);
        return res.status(500).json({ error: 'Failed to create certification' });
      }

      db.get(`
        SELECT c.*, e.name AS employee_name
        FROM certifications c
        JOIN employees e ON c.employee_id = e.id
        WHERE c.id = ?
      `, this.lastID, (err2, cert) => {
        if (err2) {
          console.error('Error fetching created certification:', err2.message);
          return res.status(500).json({ error: 'Failed to fetch certification' });
        }
        res.status(201).json(cert);
      });
    });
  });
});

// PUT /api/certifications/:id - Update certification
router.put('/:id', (req, res) => {
  const { certification_name, expiry_date } = req.body;

  db.get('SELECT id FROM certifications WHERE id = ?', req.params.id, (err, cert) => {
    if (err) {
      console.error('Error checking certification:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!cert) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    db.run(`
      UPDATE certifications SET certification_name = ?, expiry_date = ?
      WHERE id = ?
    `, [certification_name, expiry_date, req.params.id], function(err) {
      if (err) {
        console.error('Error updating certification:', err.message);
        return res.status(500).json({ error: 'Failed to update certification' });
      }

      db.get(`
        SELECT c.*, e.name AS employee_name
        FROM certifications c
        JOIN employees e ON c.employee_id = e.id
        WHERE c.id = ?
      `, req.params.id, (err2, updated) => {
        if (err2) {
          console.error('Error fetching updated certification:', err2.message);
          return res.status(500).json({ error: 'Failed to fetch certification' });
        }
        res.json(updated);
      });
    });
  });
});

// DELETE /api/certifications/:id - Delete certification
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM certifications WHERE id = ?', req.params.id, function(err) {
    if (err) {
      console.error('Error deleting certification:', err.message);
      return res.status(500).json({ error: 'Failed to delete certification' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.status(204).send();
  });
});

module.exports = router;