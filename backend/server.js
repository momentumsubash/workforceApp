const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) {
  console.log('dotenv not found, using default environment');
}

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// CORS Configuration - Allow frontend
// ============================================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// Routes
const employeeRoutes = require('./routes/employees');
const trainingRoutes = require('./routes/trainings');
const certificationRoutes = require('./routes/certifications');

app.use('/api/employees', employeeRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/certifications', certificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Departments endpoint
app.get('/api/departments', (req, res) => {
  const db = require('./db/database');
  db.all('SELECT * FROM departments ORDER BY name', (err, departments) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(departments);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Auto-seed on first run
async function initializeDatabase() {
  const db = require('./db/database');
  
  db.get('SELECT COUNT(*) as count FROM employees', (err, row) => {
    if (err) {
      console.error('Error checking database:', err.message);
      console.log('Starting server anyway...');
      startServer();
      return;
    }
    
    const count = row ? row.count : 0;
    if (count === 0) {
      console.log('Empty database detected. Running seeder...');
      try {
        require('./seeders/seed');
      } catch (seedErr) {
        console.error('Seeder error:', seedErr.message);
      }
    } else {
      console.log(`Database already has ${count} employees. Skipping seed.`);
    }
    startServer();
  });
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`\n  WorkForcePro API Server`);
    console.log(`  ─────────────────────`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Listening on: http://localhost:${PORT}`);
    console.log(`  API Base: http://localhost:${PORT}/api\n`);
  });
}

// Start the application
initializeDatabase();