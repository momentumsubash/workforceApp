import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const demoUsers = [
    { email: 'jane.smith@workforcepro.com', role: 'Supervisor' },
    { email: 'mike.johnson@workforcepro.com', role: 'Supervisor' },
    { email: 'sarah.williams@workforcepro.com', role: 'Supervisor' },
    { email: 'david.brown@workforcepro.com', role: 'Supervisor' },
    { email: 'emily.davis@workforcepro.com', role: 'Supervisor' },
    { email: 'john.doe@workforcepro.com', role: 'Employee' },
    { email: 'bob.wilson@workforcepro.com', role: 'Employee' },
    { email: 'alice.brown@workforcepro.com', role: 'Employee' },
    { email: 'charlie.davis@workforcepro.com', role: 'Employee' },
    { email: 'diana.evans@workforcepro.com', role: 'Employee' },
    { email: 'frank.garcia@workforcepro.com', role: 'Employee' },
    { email: 'grace.harris@workforcepro.com', role: 'Employee' },
    { email: 'henry.irving@workforcepro.com', role: 'Employee' },
    { email: 'iris.jackson@workforcepro.com', role: 'Employee' },
    { email: 'jack.kelly@workforcepro.com', role: 'Employee' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setTimeout(() => {
      const formEvent = new Event('submit', { bubbles: true });
      document.getElementById('login-form').dispatchEvent(formEvent);
    }, 300);
  };

  return (
    <div className="login-container" data-cy="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🔧 WorkForcePro</h1>
          <p>Workforce Management Platform</p>
        </div>

        <form id="login-form" className="login-form" onSubmit={handleSubmit} data-cy="login-form">
          {error && <div className="login-error" data-cy="login-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              data-cy="email-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              data-cy="password-input"
            />
            <small className="password-hint">(Any password works for demo)</small>
          </div>

          <button type="submit" className="login-btn" disabled={loading} data-cy="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title" data-cy="demo-title">Quick Demo Login (Click any email):</p>
          <div className="demo-grid">
            <div className="demo-group" data-cy="demo-supervisor-group">
              <p className="demo-role">👔 Supervisors</p>
              {demoUsers.filter(u => u.role === 'Supervisor').map((user, idx) => (
                <button
                  key={user.email}
                  className="demo-btn supervisor"
                  onClick={() => handleDemoLogin(user.email)}
                  data-cy={`demo-btn-supervisor-${idx + 1}`}
                >
                  {user.email}
                </button>
              ))}
            </div>
            <div className="demo-group" data-cy="demo-employee-group">
              <p className="demo-role">👤 Employees</p>
              {demoUsers.filter(u => u.role === 'Employee').map((user, idx) => (
                <button
                  key={user.email}
                  className="demo-btn employee"
                  onClick={() => handleDemoLogin(user.email)}
                  data-cy={`demo-btn-employee-${idx + 1}`}
                >
                  {user.email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
