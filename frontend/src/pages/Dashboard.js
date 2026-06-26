import React from 'react';
import Layout from '../components/common/Layout';
import DashboardStats from '../components/dashboard/DashboardStats';
import authService from '../services/authService';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const isSupervisor = authService.isSupervisor();

  return (
    <Layout title="Dashboard">
      <div className="user-greeting" data-cy="user-greeting">
        <h2>👋 Welcome, {user?.name}!</h2>
        <p data-cy="user-role-info">
          You are logged in as <strong>{isSupervisor ? 'Supervisor' : 'Employee'}</strong>
          {isSupervisor && ' - You can manage employees and approve trainings'}
          {!isSupervisor && ' - You can complete your assigned trainings'}
        </p>
      </div>
      <DashboardStats />
    </Layout>
  );
};

export default Dashboard;
