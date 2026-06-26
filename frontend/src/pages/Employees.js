import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import EmployeeList from '../components/employees/EmployeeList';
import authService from '../services/authService';

const Employees = () => {
  const isSupervisor = authService.isSupervisor();

  if (!isSupervisor) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout title="Employees">
      <div className="page-header" data-cy="employees-page-header">
        <h2 data-cy="employees-page-title">👥 Employee Management</h2>
        <p data-cy="employees-page-desc">Manage employees, assign trainings, track completions</p>
      </div>
      <div className="page-grid">
        <EmployeeList />
      </div>
    </Layout>
  );
};

export default Employees;
