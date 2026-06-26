import React from 'react';
import Layout from '../components/common/Layout';
import TrainingList from '../components/trainings/TrainingList';
import authService from '../services/authService';

const Trainings = () => {
  const isSupervisor = authService.isSupervisor();

  return (
    <Layout title="Trainings">
      <div className="page-header" data-cy="trainings-page-header">
        <h2 data-cy="trainings-page-title">📚 Training Management</h2>
        <p data-cy="trainings-page-desc">
          {isSupervisor 
            ? 'Assign, approve, and manage employee training modules'
            : 'View and complete your assigned training modules'
          }
        </p>
      </div>
      <div className="page-grid">
        <TrainingList />
      </div>
    </Layout>
  );
};

export default Trainings;
