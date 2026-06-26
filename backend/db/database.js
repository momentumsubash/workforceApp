const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'workforcepro.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys and WAL mode
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      department_id INTEGER,
      supervisor_id INTEGER,
      supervisor_name TEXT DEFAULT 'Unassigned',
      is_supervisor BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id),
      FOREIGN KEY (supervisor_id) REFERENCES employees(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employee_trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      training_id INTEGER NOT NULL,
      due_date TEXT,
      status TEXT DEFAULT 'assigned' CHECK(status IN ('assigned', 'completed', 'approved', 'rejected')),
      completion_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (training_id) REFERENCES trainings(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      certification_name TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);
});

// Async helpers
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Synchronous helper for seeder using db.serialize
db.prepare = function(sql) {
  return {
    run: function(...params) {
      let result = null;
      let error = null;
      db.serialize(() => {
        db.run(sql, params, function(err) {
          if (err) error = err;
          else result = { lastInsertRowid: this.lastID, changes: this.changes };
        });
      });
      if (error) throw error;
      return result;
    },
    get: function(...params) {
      let result = null;
      let error = null;
      db.serialize(() => {
        db.get(sql, params, (err, row) => {
          if (err) error = err;
          else result = row;
        });
      });
      if (error) throw error;
      return result;
    },
    all: function(...params) {
      let result = null;
      let error = null;
      db.serialize(() => {
        db.all(sql, params, (err, rows) => {
          if (err) error = err;
          else result = rows;
        });
      });
      if (error) throw error;
      return result;
    }
  };
};

module.exports = db;