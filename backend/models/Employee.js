const db = require('../db/database');

class Employee {
  static findAll() {
    return db.prepare(`
      SELECT e.*, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.name
    `).all();
  }

  static findById(id) {
    return db.prepare(`
      SELECT e.*, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = ?
    `).get(id);
  }

  static findByEmail(email) {
    return db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
  }

  static findByEmployeeId(employee_id) {
    return db.prepare('SELECT * FROM employees WHERE employee_id = ?').get(employee_id);
  }

  static create(data) {
    const { employee_id, name, email, department_id, supervisor } = data;
    const result = db.prepare(`
      INSERT INTO employees (employee_id, name, email, department_id, supervisor)
      VALUES (?, ?, ?, ?, ?)
    `).run(employee_id, name, email, department_id || null, supervisor || 'Unassigned');
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const { name, email, department_id, supervisor } = data;
    db.prepare(`
      UPDATE employees SET name = ?, email = ?, department_id = ?, supervisor = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, email, department_id, supervisor, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  }

  static getTrainings(employeeId) {
    return db.prepare(`
      SELECT et.*, t.training_name
      FROM employee_trainings et
      JOIN trainings t ON et.training_id = t.id
      WHERE et.employee_id = ?
      ORDER BY et.created_at DESC
    `).all(employeeId);
  }

  static getCertifications(employeeId) {
    return db.prepare(`
      SELECT c.*, e.name AS employee_name
      FROM certifications c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.employee_id = ?
      ORDER BY c.expiry_date
    `).all(employeeId);
  }
}

module.exports = Employee;