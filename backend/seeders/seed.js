const db = require('../db/database');

function seed(force = false) {
  console.log('Seeding database...');

  if (!force) {
    db.get('SELECT COUNT(*) as count FROM employees', (err, row) => {
      if (err) {
        console.error('Error checking database:', err.message);
        return;
      }
      if (row && row.count > 0) {
        console.log(`Database already has ${row.count} employees.`);
        console.log('Use --force to reset and re-seed.');
        return;
      }
      performSeed();
    });
  } else {
    console.log('⚠️  Force mode enabled. Resetting database...');
    performSeed();
  }
}

function performSeed() {
  console.log('🌱 Seeding database from scratch...');

  // Disable foreign key constraints temporarily
  db.run('PRAGMA foreign_keys = OFF', () => {
    console.log('🗑️  Dropping existing tables...');
    db.run('DROP TABLE IF EXISTS certifications');
    db.run('DROP TABLE IF EXISTS employee_trainings');
    db.run('DROP TABLE IF EXISTS trainings');
    db.run('DROP TABLE IF EXISTS employees');
    db.run('DROP TABLE IF EXISTS departments', () => {
      db.run('PRAGMA foreign_keys = ON', () => {
        console.log('✅ Tables dropped.');
        createTables();
      });
    });
  });
}

function createTables() {
  console.log('📋 Creating fresh tables...');
  
  db.run('PRAGMA foreign_keys = OFF', () => {
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
    `, () => {
      db.run('PRAGMA foreign_keys = ON', () => {
        console.log('✅ Tables created.');
        seedDepartments();
      });
    });
  });
}

// ============================================================
// SEED DEPARTMENTS
// ============================================================
function seedDepartments() {
  console.log('🌱 Seeding data...');

  const departments = [
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

  let deptCounter = 0;
  
  departments.forEach(dept => {
    db.run('INSERT OR IGNORE INTO departments (name) VALUES (?)', [dept], (err) => {
      if (err) console.error(`  ⚠️ Failed to insert department: ${dept}`);
      deptCounter++;
      if (deptCounter === departments.length) {
        console.log(`  ✅ ${departments.length} departments seeded`);
        seedTrainings();
      }
    });
  });
}

// ============================================================
// SEED TRAININGS
// ============================================================
function seedTrainings() {
  const trainingModules = [
    { name: 'Safety Training', desc: 'Workplace safety and hazard awareness' },
    { name: 'Compliance Training', desc: 'Regulatory compliance and company policies' },
    { name: 'Cyber Security Training', desc: 'Information security best practices' },
    { name: 'Leadership Training', desc: 'Team management and leadership skills' },
    { name: 'First Aid Training', desc: 'Basic first aid and emergency response' },
    { name: 'Diversity & Inclusion', desc: 'Workplace diversity and inclusion awareness' },
    { name: 'Data Privacy Training', desc: 'GDPR and data handling procedures' },
    { name: 'Project Management', desc: 'Project planning and execution fundamentals' }
  ];

  let trainingCounter = 0;
  
  trainingModules.forEach(t => {
    db.run('INSERT OR IGNORE INTO trainings (training_name, description) VALUES (?, ?)', [t.name, t.desc], (err) => {
      if (err) console.error(`  ⚠️ Failed to insert training: ${t.name}`);
      trainingCounter++;
      if (trainingCounter === trainingModules.length) {
        console.log(`  ✅ ${trainingModules.length} training modules seeded`);
        seedSupervisors();
      }
    });
  });
}

// ============================================================
// SEED SUPERVISORS
// ============================================================
function seedSupervisors() {
  const supervisors = [
    { emp_id: 'SUP001', name: 'Jane Smith', email: 'jane.smith@workforcepro.com', dept: 'Engineering' },
    { emp_id: 'SUP002', name: 'Mike Johnson', email: 'mike.johnson@workforcepro.com', dept: 'Human Resources' },
    { emp_id: 'SUP003', name: 'Sarah Williams', email: 'sarah.williams@workforcepro.com', dept: 'Finance' },
    { emp_id: 'SUP004', name: 'David Brown', email: 'david.brown@workforcepro.com', dept: 'Marketing' },
    { emp_id: 'SUP005', name: 'Emily Davis', email: 'emily.davis@workforcepro.com', dept: 'Operations' }
  ];

  let supervisorCounter = 0;
  const supervisorIds = [];

  supervisors.forEach(emp => {
    db.get('SELECT id FROM departments WHERE name = ?', [emp.dept], (err, deptRow) => {
      if (err || !deptRow) {
        console.error(`  ⚠️ Department not found for ${emp.name}`);
        supervisorCounter++;
        return;
      }

      db.run(
        `INSERT OR IGNORE INTO employees (employee_id, name, email, department_id, is_supervisor)
         VALUES (?, ?, ?, ?, ?)`,
        [emp.emp_id, emp.name, emp.email, deptRow.id, 1],
        function(err) {
          if (err) {
            console.error(`  ⚠️ Failed to insert supervisor: ${emp.name}`);
          } else {
            supervisorIds.push({ id: this.lastID, name: emp.name });
          }
          supervisorCounter++;
          if (supervisorCounter === supervisors.length) {
            console.log(`  ✅ ${supervisors.length} supervisors seeded`);
            seedEmployees(supervisorIds);
          }
        }
      );
    });
  });
}

// ============================================================
// SEED EMPLOYEES
// ============================================================
function seedEmployees(supervisorIds) {
  const supervisorMap = {};
  supervisorIds.forEach(s => { supervisorMap[s.name] = s.id; });

  const employees = [
    { emp_id: 'EMP001', name: 'John Doe', email: 'john.doe@workforcepro.com', dept: 'Engineering', supervisor: 'Jane Smith' },
    { emp_id: 'EMP002', name: 'Bob Wilson', email: 'bob.wilson@workforcepro.com', dept: 'Human Resources', supervisor: 'Mike Johnson' },
    { emp_id: 'EMP003', name: 'Alice Brown', email: 'alice.brown@workforcepro.com', dept: 'Finance', supervisor: 'Sarah Williams' },
    { emp_id: 'EMP004', name: 'Charlie Davis', email: 'charlie.davis@workforcepro.com', dept: 'Marketing', supervisor: 'David Brown' },
    { emp_id: 'EMP005', name: 'Diana Evans', email: 'diana.evans@workforcepro.com', dept: 'Operations', supervisor: 'Emily Davis' },
    { emp_id: 'EMP006', name: 'Frank Garcia', email: 'frank.garcia@workforcepro.com', dept: 'Sales', supervisor: 'Jane Smith' },
    { emp_id: 'EMP007', name: 'Grace Harris', email: 'grace.harris@workforcepro.com', dept: 'IT Support', supervisor: 'Mike Johnson' },
    { emp_id: 'EMP008', name: 'Henry Irving', email: 'henry.irving@workforcepro.com', dept: 'Legal', supervisor: 'Sarah Williams' },
    { emp_id: 'EMP009', name: 'Iris Jackson', email: 'iris.jackson@workforcepro.com', dept: 'Research & Development', supervisor: 'David Brown' },
    { emp_id: 'EMP010', name: 'Jack Kelly', email: 'jack.kelly@workforcepro.com', dept: 'Customer Support', supervisor: 'Emily Davis' }
  ];

  let employeeCounter = 0;
  const employeeIds = [];

  employees.forEach(emp => {
    db.get('SELECT id FROM departments WHERE name = ?', [emp.dept], (err, deptRow) => {
      if (err || !deptRow) {
        console.error(`  ⚠️ Department not found for ${emp.name}`);
        employeeCounter++;
        return;
      }

      const supervisorId = supervisorMap[emp.supervisor] || null;
      
      db.run(
        `INSERT OR IGNORE INTO employees (employee_id, name, email, department_id, supervisor_id, supervisor_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [emp.emp_id, emp.name, emp.email, deptRow.id, supervisorId, emp.supervisor],
        function(err) {
          if (err) {
            console.error(`  ⚠️ Failed to insert employee: ${emp.name}`);
          } else {
            employeeIds.push({ id: this.lastID, name: emp.name });
          }
          employeeCounter++;
          if (employeeCounter === employees.length) {
            console.log(`  ✅ ${employees.length} employees seeded`);
            seedEmployeeTrainings(employeeIds);
          }
        }
      );
    });
  });
}

// ============================================================
// SEED EMPLOYEE TRAININGS
// ============================================================
function seedEmployeeTrainings(employeeIds) {
  const empMap = {};
  employeeIds.forEach(e => { empMap[e.name] = e.id; });

  db.all('SELECT id, training_name FROM trainings', (err, trainings) => {
    if (err) {
      console.error('Error fetching trainings:', err.message);
      return;
    }

    const trainingMap = {};
    trainings.forEach(t => { trainingMap[t.training_name] = t.id; });

    const employeeTrainings = [
      { emp: 'John Doe', training: 'Safety Training', due: '2026-07-15', status: 'assigned' },
      { emp: 'John Doe', training: 'Compliance Training', due: '2026-06-01', status: 'completed', completed: '2026-05-20' },
      { emp: 'Bob Wilson', training: 'Cyber Security Training', due: '2026-08-01', status: 'assigned' },
      { emp: 'Bob Wilson', training: 'Safety Training', due: '2026-06-15', status: 'approved', completed: '2026-05-25' },
      { emp: 'Alice Brown', training: 'Leadership Training', due: '2026-05-15', status: 'approved', completed: '2026-04-30' },
      { emp: 'Charlie Davis', training: 'Compliance Training', due: '2026-07-01', status: 'assigned' },
      { emp: 'Charlie Davis', training: 'Safety Training', due: '2026-06-30', status: 'completed', completed: '2026-06-15' },
      { emp: 'Diana Evans', training: 'First Aid Training', due: '2026-09-01', status: 'assigned' },
      { emp: 'Frank Garcia', training: 'Leadership Training', due: '2026-08-15', status: 'assigned' },
      { emp: 'Grace Harris', training: 'Diversity & Inclusion', due: '2026-07-30', status: 'assigned' },
      { emp: 'Henry Irving', training: 'Data Privacy Training', due: '2026-06-20', status: 'assigned' },
      { emp: 'Iris Jackson', training: 'Project Management', due: '2026-05-30', status: 'completed', completed: '2026-05-15' },
      { emp: 'Jack Kelly', training: 'Cyber Security Training', due: '2026-05-01', status: 'rejected' }
    ];

    let etCounter = 0;
    employeeTrainings.forEach(et => {
      const empId = empMap[et.emp];
      const trainingId = trainingMap[et.training];
      
      if (empId && trainingId) {
        db.run(
          `INSERT OR IGNORE INTO employee_trainings (employee_id, training_id, due_date, status, completion_date)
           VALUES (?, ?, ?, ?, ?)`,
          [empId, trainingId, et.due, et.status, et.completed || null],
          (err) => {
            if (err) console.error(`  ⚠️ Failed to insert training: ${et.emp} - ${et.training}`);
            etCounter++;
            if (etCounter === employeeTrainings.length) {
              console.log(`  ✅ ${employeeTrainings.length} training assignments seeded`);
              seedCertifications(empMap);
            }
          }
        );
      } else {
        etCounter++;
        if (etCounter === employeeTrainings.length) {
          console.log(`  ✅ ${employeeTrainings.length} training assignments seeded`);
          seedCertifications(empMap);
        }
      }
    });
  });
}

// ============================================================
// SEED CERTIFICATIONS
// ============================================================
function seedCertifications(empMap) {
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const twentyNineDaysLater = new Date(today);
  twentyNineDaysLater.setDate(twentyNineDaysLater.getDate() + 29);
  const thirtyOneDaysLater = new Date(today);
  thirtyOneDaysLater.setDate(thirtyOneDaysLater.getDate() + 31);
  const sixtyDaysLater = new Date(today);
  sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);
  const ninetyDaysLater = new Date(today);
  ninetyDaysLater.setDate(ninetyDaysLater.getDate() + 90);
  const formatDate = (date) => date.toISOString().split('T')[0];

  const certifications = [
    { emp: 'John Doe', name: 'AWS Certified Solutions Architect', expiry: formatDate(thirtyOneDaysLater) },
    { emp: 'John Doe', name: 'Certified ScrumMaster', expiry: formatDate(sixtyDaysLater) },
    { emp: 'Bob Wilson', name: 'Project Management Professional (PMP)', expiry: formatDate(ninetyDaysLater) },
    { emp: 'Alice Brown', name: 'SHRM Certified Professional', expiry: formatDate(twentyNineDaysLater) },
    { emp: 'Charlie Davis', name: 'Certified Public Accountant (CPA)', expiry: formatDate(thirtyDaysLater) },
    { emp: 'Diana Evans', name: 'Google Analytics Certified', expiry: formatDate(twentyNineDaysLater) },
    { emp: 'Frank Garcia', name: 'Six Sigma Green Belt', expiry: formatDate(sixtyDaysLater) },
    { emp: 'Grace Harris', name: 'Certified Sales Professional', expiry: formatDate(ninetyDaysLater) },
    { emp: 'Henry Irving', name: 'CompTIA Security+', expiry: formatDate(thirtyOneDaysLater) },
    { emp: 'Henry Irving', name: 'Cisco Certified Network Associate', expiry: formatDate(sixtyDaysLater) },
    { emp: 'Iris Jackson', name: 'Certified Information Privacy Professional', expiry: formatDate(ninetyDaysLater) },
    { emp: 'Jack Kelly', name: 'Certified Research Administrator', expiry: formatDate(thirtyOneDaysLater) }
  ];

  let certCounter = 0;
  
  certifications.forEach(c => {
    const empId = empMap[c.emp];
    if (empId) {
      db.run(
        `INSERT OR IGNORE INTO certifications (employee_id, certification_name, expiry_date)
         VALUES (?, ?, ?)`,
        [empId, c.name, c.expiry],
        (err) => {
          if (err) console.error(`  ⚠️ Failed to insert certification: ${c.name}`);
          certCounter++;
          if (certCounter === certifications.length) {
            console.log(`  ✅ ${certifications.length} certifications seeded`);
            printSummary();
          }
        }
      );
    } else {
      certCounter++;
      if (certCounter === certifications.length) {
        console.log(`  ✅ ${certifications.length} certifications seeded`);
        printSummary();
      }
    }
  });
}

function printSummary() {
  console.log('\n✅ Database seeded successfully!');
  console.log(`📊 Summary:`);
  console.log(`  - 10 departments`);
  console.log(`  - 8 training modules`);
  console.log(`  - 5 supervisors`);
  console.log(`  - 10 employees`);
  console.log(`  - 13 training assignments`);
  console.log(`  - 12 certifications`);
  console.log('\n🔍 Test Data for OJT Requirements:');
  console.log('  👤 Supervisors: Jane Smith, Mike Johnson, Sarah Williams, David Brown, Emily Davis');
  console.log('  👤 Employees: John Doe, Bob Wilson, Alice Brown, Charlie Davis, Diana Evans, Frank Garcia, Grace Harris, Henry Irving, Iris Jackson, Jack Kelly');
  console.log('\n⚠️  Note: This application contains intentional bugs for testing!');
  console.log('   See test plan for details.');
}

// Parse command line arguments
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

if (require.main === module) {
  seed(force);
}

module.exports = seed;