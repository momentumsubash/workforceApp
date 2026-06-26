const db = require('../db/database');

class Department {
  static findAll() {
    return db.prepare('SELECT * FROM departments ORDER BY name').all();
  }

  static findById(id) {
    return db.prepare('SELECT * FROM departments WHERE id = ?').get(id);
  }

  static findByName(name) {
    return db.prepare('SELECT * FROM departments WHERE name = ?').get(name);
  }

  static create(name) {
    const result = db.prepare('INSERT INTO departments (name) VALUES (?)').run(name);
    return this.findById(result.lastInsertRowid);
  }

  static update(id, name) {
    db.prepare('UPDATE departments SET name = ? WHERE id = ?').run(name, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM departments WHERE id = ?').run(id);
  }

  static getEmployees(deptId) {
    return db.prepare(`
      SELECT * FROM employees WHERE department_id = ? ORDER BY name
    `).all(deptId);
  }
}

module.exports = Department;