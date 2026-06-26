const db = require('../db/database');

function validateEmployee(req, res, next) {
  const { name, employee_id, email } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Employee name is required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  next();
}

function checkDuplicateEmail(req, res, next) {
  const { email } = req.body;
  // BUG DEF-001: Duplicate email validation is skipped intentionally
  // Uncomment the lines below to fix
  /*
  db.get('SELECT id FROM employees WHERE email = ?', [email], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (existing) {
      return res.status(400).json({ error: 'Email must be unique' });
    }
    next();
  });
  */
  next();
}

function checkDuplicateEmployeeId(req, res, next) {
  const { employee_id } = req.body;
  // BUG DEF-005: Duplicate employee_id validation is skipped intentionally
  // Uncomment the lines below to fix
  /*
  db.get('SELECT id FROM employees WHERE employee_id = ?', [employee_id], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (existing) {
      return res.status(400).json({ error: 'Employee ID must be unique' });
    }
    next();
  });
  */
  next();
}

function validateTrainingAssignment(req, res, next) {
  const { employee_id, training_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!training_id) {
    return res.status(400).json({ error: 'Training ID is required' });
  }

  db.get('SELECT id FROM employees WHERE id = ?', [employee_id], (err, employee) => {
    if (err) {
      console.error('Error checking employee:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.get('SELECT id FROM trainings WHERE id = ?', [training_id], (err2, training) => {
      if (err2) {
        console.error('Error checking training:', err2.message);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!training) {
        return res.status(404).json({ error: 'Training not found' });
      }

      next();
    });
  });
}

function validateCertification(req, res, next) {
  const { employee_id, certification_name, expiry_date } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  if (!certification_name) {
    return res.status(400).json({ error: 'Certification name is required' });
  }
  if (!expiry_date) {
    return res.status(400).json({ error: 'Expiry date is required' });
  }

  next();
}

module.exports = {
  validateEmployee,
  checkDuplicateEmail,
  checkDuplicateEmployeeId,
  validateTrainingAssignment,
  validateCertification
};