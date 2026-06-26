const db = require('../db/database');

class Certification {
  static findAll() {
    return db.prepare(`
      SELECT c.*, e.name AS employee_name
      FROM certifications c
      JOIN employees e ON c.employee_id = e.id
      ORDER BY c.expiry_date
    `).all();
  }

  static findById(id) {
    return db.prepare(`
      SELECT c.*, e.name AS employee_name
      FROM certifications c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.id = ?
    `).get(id);
  }

  static findByEmployee(employeeId) {
    return db.prepare(`
      SELECT c.*, e.name AS employee_name
      FROM certifications c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.employee_id = ?
      ORDER BY c.expiry_date
    `).all(employeeId);
  }

  static findExpiringWithinDays(days = 30) {
    const today = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    const todayStr = today.toISOString().split('T')[0];
    const futureStr = future.toISOString().split('T')[0];

    return db.prepare(`
      SELECT c.*, e.name AS employee_name,
             CAST(julianday(c.expiry_date) - julianday(?) AS INTEGER) AS days_remaining
      FROM certifications c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.expiry_date BETWEEN ? AND ?
        AND CAST(julianday(c.expiry_date) - julianday(?) AS INTEGER) <= ?
      ORDER BY c.expiry_date
    `).all(todayStr, todayStr, futureStr, todayStr, days);
  }

  static create(data) {
    const { employee_id, certification_name, expiry_date } = data;
    const result = db.prepare(`
      INSERT INTO certifications (employee_id, certification_name, expiry_date)
      VALUES (?, ?, ?)
    `).run(employee_id, certification_name, expiry_date);
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const { certification_name, expiry_date } = data;
    db.prepare(`
      UPDATE certifications SET certification_name = ?, expiry_date = ?
      WHERE id = ?
    `).run(certification_name, expiry_date, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM certifications WHERE id = ?').run(id);
  }
}

module.exports = Certification;