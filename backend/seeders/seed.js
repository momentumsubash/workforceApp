const db = require('../db/database');

function run(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params || [], function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params || [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function seed(force = false) {
  console.log('Seeding database...');

  if (!force) {
    const row = await get('SELECT COUNT(*) as count FROM employees');
    if (row && row.count > 0) {
      console.log(`Database already has ${row.count} employees.`);
      console.log('Use --force to reset and re-seed.');
      return;
    }
  } else {
    console.log('⚠️  Force mode enabled. Resetting database...');
  }
  await performSeed();
}

async function performSeed() {
  console.log('🌱 Seeding database from scratch...');

  await run('PRAGMA foreign_keys = OFF');
  console.log('🗑️  Dropping existing tables...');
  await run('DROP TABLE IF EXISTS certifications');
  await run('DROP TABLE IF EXISTS employee_trainings');
  await run('DROP TABLE IF EXISTS trainings');
  await run('DROP TABLE IF EXISTS employees');
  await run('DROP TABLE IF EXISTS departments');
  console.log('✅ Tables dropped.');

  console.log('📋 Creating fresh tables...');
  await run('PRAGMA foreign_keys = OFF');
  await run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run(`
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
  await run(`
    CREATE TABLE IF NOT EXISTS trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run(`
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
  await run(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      certification_name TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);
  await run('PRAGMA foreign_keys = ON');
  console.log('✅ Tables created.');

  await seedAll();
}

async function seedAll() {
  console.log('🌱 Seeding data...');

  await seedDepartments();
  await seedTrainings();
  await seedSupervisors();
  await seedEmployees();
  await seedEmployeeTrainings();
  await seedCertifications();
  printSummary();
}

async function seedDepartments() {
  const list = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'IT Support',
    'Legal',
    'Research & Development',
    'Customer Support'
  ];
  for (let i = 0; i < list.length; i++) {
    await run('INSERT INTO departments (id, name) VALUES (?, ?)', [i + 1, list[i]]);
  }
  console.log(`  ✅ ${list.length} departments seeded`);
}

async function seedTrainings() {
  const modules = [
    { id: 1, name: 'Safety Training', desc: 'Workplace safety and hazard awareness' },
    { id: 2, name: 'Compliance Training', desc: 'Regulatory compliance and company policies' },
    { id: 3, name: 'Cyber Security Training', desc: 'Information security best practices' },
    { id: 4, name: 'Leadership Training', desc: 'Team management and leadership skills' },
    { id: 5, name: 'First Aid Training', desc: 'Basic first aid and emergency response' },
    { id: 6, name: 'Diversity & Inclusion', desc: 'Workplace diversity and inclusion awareness' },
    { id: 7, name: 'Data Privacy Training', desc: 'GDPR and data handling procedures' },
    { id: 8, name: 'Project Management', desc: 'Project planning and execution fundamentals' }
  ];
  for (const m of modules) {
    await run('INSERT INTO trainings (id, training_name, description) VALUES (?, ?, ?)', [m.id, m.name, m.desc]);
  }
  console.log(`  ✅ ${modules.length} training modules seeded`);
}

async function seedSupervisors() {
  const list = [
    { id: 1, emp_id: 'SUP001', name: 'Jane Smith', email: 'jane.smith@workforcepro.com', dept: 'Engineering' },
    { id: 2, emp_id: 'SUP002', name: 'Mike Johnson', email: 'mike.johnson@workforcepro.com', dept: 'Human Resources' },
    { id: 3, emp_id: 'SUP003', name: 'Sarah Williams', email: 'sarah.williams@workforcepro.com', dept: 'Finance' },
    { id: 4, emp_id: 'SUP004', name: 'David Brown', email: 'david.brown@workforcepro.com', dept: 'Marketing' },
    { id: 5, emp_id: 'SUP005', name: 'Emily Davis', email: 'emily.davis@workforcepro.com', dept: 'Operations' }
  ];
  for (const s of list) {
    const deptRow = await get('SELECT id FROM departments WHERE name = ?', [s.dept]);
    if (!deptRow) throw new Error(`Department not found: ${s.dept}`);
    await run(
      'INSERT INTO employees (id, employee_id, name, email, department_id, is_supervisor) VALUES (?, ?, ?, ?, ?, 1)',
      [s.id, s.emp_id, s.name, s.email, deptRow.id]
    );
  }
  console.log(`  ✅ ${list.length} supervisors seeded`);
}

async function seedEmployees() {
  const list = [
    { id: 6, emp_id: 'EMP001', name: 'John Doe', email: 'john.doe@workforcepro.com', dept: 'Engineering', supervisorId: 1 },
    { id: 7, emp_id: 'EMP002', name: 'Bob Wilson', email: 'bob.wilson@workforcepro.com', dept: 'Human Resources', supervisorId: 2 },
    { id: 8, emp_id: 'EMP003', name: 'Alice Brown', email: 'alice.brown@workforcepro.com', dept: 'Finance', supervisorId: 3 },
    { id: 9, emp_id: 'EMP004', name: 'Charlie Davis', email: 'charlie.davis@workforcepro.com', dept: 'Marketing', supervisorId: 4 },
    { id: 10, emp_id: 'EMP005', name: 'Diana Evans', email: 'diana.evans@workforcepro.com', dept: 'Operations', supervisorId: 5 },
    { id: 11, emp_id: 'EMP006', name: 'Frank Garcia', email: 'frank.garcia@workforcepro.com', dept: 'Sales', supervisorId: 1 },
    { id: 12, emp_id: 'EMP007', name: 'Grace Harris', email: 'grace.harris@workforcepro.com', dept: 'IT Support', supervisorId: 2 },
    { id: 13, emp_id: 'EMP008', name: 'Henry Irving', email: 'henry.irving@workforcepro.com', dept: 'Legal', supervisorId: 3 },
    { id: 14, emp_id: 'EMP009', name: 'Iris Jackson', email: 'iris.jackson@workforcepro.com', dept: 'Research & Development', supervisorId: 4 },
    { id: 15, emp_id: 'EMP010', name: 'Jack Kelly', email: 'jack.kelly@workforcepro.com', dept: 'Customer Support', supervisorId: 5 }
  ];
  for (const e of list) {
    const deptRow = await get('SELECT id FROM departments WHERE name = ?', [e.dept]);
    if (!deptRow) throw new Error(`Department not found: ${e.dept}`);
    await run(
      'INSERT INTO employees (id, employee_id, name, email, department_id, supervisor_id, supervisor_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [e.id, e.emp_id, e.name, e.email, deptRow.id, e.supervisorId, null]
    );
  }
  console.log(`  ✅ ${list.length} employees seeded`);
}

async function seedEmployeeTrainings() {
  const list = [
    { empId: 6, trainingId: 1, due: '2026-07-15', status: 'assigned' },
    { empId: 6, trainingId: 2, due: '2026-06-01', status: 'completed', completed: '2026-05-20' },
    { empId: 7, trainingId: 3, due: '2026-08-01', status: 'assigned' },
    { empId: 7, trainingId: 1, due: '2026-06-15', status: 'approved', completed: '2026-05-25' },
    { empId: 8, trainingId: 4, due: '2026-05-15', status: 'approved', completed: '2026-04-30' },
    { empId: 9, trainingId: 2, due: '2026-07-01', status: 'assigned' },
    { empId: 9, trainingId: 1, due: '2026-06-30', status: 'completed', completed: '2026-06-15' },
    { empId: 10, trainingId: 5, due: '2026-09-01', status: 'assigned' },
    { empId: 11, trainingId: 4, due: '2026-08-15', status: 'assigned' },
    { empId: 12, trainingId: 6, due: '2026-07-30', status: 'assigned' },
    { empId: 13, trainingId: 7, due: '2026-06-20', status: 'assigned' },
    { empId: 14, trainingId: 8, due: '2026-05-30', status: 'completed', completed: '2026-05-15' },
    { empId: 15, trainingId: 3, due: '2026-05-01', status: 'rejected' }
  ];
  for (const et of list) {
    await run(
      'INSERT INTO employee_trainings (employee_id, training_id, due_date, status, completion_date) VALUES (?, ?, ?, ?, ?)',
      [et.empId, et.trainingId, et.due, et.status, et.completed || null]
    );
  }
  console.log(`  ✅ ${list.length} training assignments seeded`);
}

async function seedCertifications() {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const d29 = fmt(new Date(today.getTime() + 29 * 86400000));
  const d30 = fmt(new Date(today.getTime() + 30 * 86400000));
  const d31 = fmt(new Date(today.getTime() + 31 * 86400000));
  const d60 = fmt(new Date(today.getTime() + 60 * 86400000));
  const d90 = fmt(new Date(today.getTime() + 90 * 86400000));

  const list = [
    { empId: 6, name: 'AWS Certified Solutions Architect', expiry: d31 },
    { empId: 6, name: 'Certified ScrumMaster', expiry: d60 },
    { empId: 7, name: 'Project Management Professional (PMP)', expiry: d90 },
    { empId: 8, name: 'SHRM Certified Professional', expiry: d29 },
    { empId: 9, name: 'Certified Public Accountant (CPA)', expiry: d30 },
    { empId: 10, name: 'Google Analytics Certified', expiry: d29 },
    { empId: 11, name: 'Six Sigma Green Belt', expiry: d60 },
    { empId: 12, name: 'Certified Sales Professional', expiry: d90 },
    { empId: 13, name: 'CompTIA Security+', expiry: d31 },
    { empId: 13, name: 'Cisco Certified Network Associate', expiry: d60 },
    { empId: 14, name: 'Certified Information Privacy Professional', expiry: d90 },
    { empId: 15, name: 'Certified Research Administrator', expiry: d31 }
  ];
  for (const c of list) {
    await run(
      'INSERT INTO certifications (employee_id, certification_name, expiry_date) VALUES (?, ?, ?)',
      [c.empId, c.name, c.expiry]
    );
  }
  console.log(`  ✅ ${list.length} certifications seeded`);
}

function printSummary() {
  console.log('\n✅ Database seeded successfully!');
  console.log('📊 Summary:');
  console.log('  - 10 departments (IDs 1-10)');
  console.log('  - 8 training modules (IDs 1-8)');
  console.log('  - 5 supervisors (IDs 1-5, is_supervisor=1)');
  console.log('  - 10 employees (IDs 6-15, is_supervisor=0)');
  console.log('  - 13 training assignments');
  console.log('  - 12 certifications');
  console.log('');
  console.log('🔍 Employee ID Mapping (stable):');
  console.log('  id= 1 | Jane Smith   (SUP001) | Engineering    | supervisor');
  console.log('  id= 2 | Mike Johnson  (SUP002) | Human Resources | supervisor');
  console.log('  id= 3 | Sarah Williams(SUP003) | Finance        | supervisor');
  console.log('  id= 4 | David Brown   (SUP004) | Marketing      | supervisor');
  console.log('  id= 5 | Emily Davis   (SUP005) | Operations     | supervisor');
  console.log('  id= 6 | John Doe      (EMP001) | Engineering    | regular');
  console.log('  id= 7 | Bob Wilson    (EMP002) | Human Resources | regular');
  console.log('  id= 8 | Alice Brown   (EMP003) | Finance        | regular');
  console.log('  id= 9 | Charlie Davis (EMP004) | Marketing      | regular');
  console.log('  id=10 | Diana Evans   (EMP005) | Operations     | regular');
  console.log('  id=11 | Frank Garcia  (EMP006) | Sales          | regular');
  console.log('  id=12 | Grace Harris  (EMP007) | IT Support     | regular');
  console.log('  id=13 | Henry Irving  (EMP008) | Legal          | regular');
  console.log('  id=14 | Iris Jackson  (EMP009) | R&D            | regular');
  console.log('  id=15 | Jack Kelly    (EMP010) | Customer Supp  | regular');
  console.log('');
  console.log('⚠️  Note: This application contains intentional bugs for testing!');
  console.log('   See test plan for details.');
  process.exit(0);
}

const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

if (require.main === module) {
  seed(force).catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  });
}

module.exports = seed;
