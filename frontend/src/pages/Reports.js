import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import authService from '../services/authService';

const Reports = () => {
  const isSupervisor = authService.isSupervisor();

  if (!isSupervisor) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout title="Reports">
      <div className="page-header" data-cy="reports-page-header">
        <h2 data-cy="reports-page-title">📈 Compliance Reports</h2>
        <p data-cy="reports-page-desc">Generate and view workforce compliance reports</p>
      </div>
      <div className="reports-container">
        <div className="report-card" data-cy="report-training-summary">
          <h3>📊 Employee Training Summary</h3>
          <p>View training completion rates by department</p>
          <button className="btn btn-primary" data-cy="generate-training-report">Generate Report</button>
        </div>
        <div className="report-card" data-cy="report-cert-expiry">
          <h3>📋 Certification Expiry Report</h3>
          <p>List all certifications expiring within 30 days</p>
          <button className="btn btn-warning" data-cy="generate-cert-report">Generate Report</button>
        </div>
        <div className="report-card" data-cy="report-compliance">
          <h3>✅ Compliance Status</h3>
          <p>Overall workforce compliance overview</p>
          <button className="btn btn-success" data-cy="generate-compliance-report">Generate Report</button>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
