const db = require('../db/database');

class Training {
  static findAll() {
    return db.prepare('SELECT * FROM trainings ORDER BY training_name').all();
  }

  static findById(id) {
    return db.prepare('SELECT * FROM trainings WHERE id = ?').get(id);
  }

  static create(data) {
    const { training_name, description } = data;
    const result = db.prepare(`
      INSERT INTO trainings (training_name, description)
      VALUES (?, ?)
    `).run(training_name, description || null);
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const { training_name, description } = data;
    db.prepare(`
      UPDATE trainings SET training_name = ?, description = ?
      WHERE id = ?
    `).run(training_name, description, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM trainings WHERE id = ?').run(id);
  }

  static getAssignments(trainingId) {
    return db.prepare(`
      SELECT et.*, e.name AS employee_name
      FROM employee_trainings et
      JOIN employees e ON et.employee_id = e.id
      WHERE et.training_id = ?
      ORDER BY et.created_at DESC
    `).all(trainingId);
  }
}

module.exports = Training;