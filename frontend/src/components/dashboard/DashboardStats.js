import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';
import trainingService from '../../services/trainingService';
import certificationService from '../../services/certificationService';

const DashboardStats = () => {
  const [stats, setStats] = useState({ employees: 0, trainings: 0, certifications: 0, expiring: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [employees, trainings, certifications, expiring] = await Promise.all([
        employeeService.getAll(),
        trainingService.getAll(),
        certificationService.getAll(),
        certificationService.getExpiring(),
      ]);
      setStats({
        employees: employees.length,
        trainings: trainings.length,
        certifications: certifications.length,
        expiring: expiring.length,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading" data-cy="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="error" data-cy="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-stats">
      <div className="stat-card" data-cy="stat-employees"><h3>👥 Employees</h3><p>{stats.employees}</p></div>
      <div className="stat-card" data-cy="stat-trainings"><h3>📚 Trainings</h3><p>{stats.trainings}</p></div>
      <div className="stat-card" data-cy="stat-certifications"><h3>🎓 Certifications</h3><p>{stats.certifications}</p></div>
      <div className="stat-card warning" data-cy="stat-expiring"><h3>🔔 Expiring</h3><p>{stats.expiring}</p></div>
    </div>
  );
};

export default DashboardStats;
