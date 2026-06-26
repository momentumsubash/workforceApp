import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';
import authService from '../../services/authService';
import TrainingAssignModal from './TrainingAssignModal';

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [employeeTrainings, setEmployeeTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const currentUser = authService.getCurrentUser();
  const isSupervisor = authService.isSupervisor();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trainingsData, employeesData, supervisorsData] = await Promise.all([
        trainingService.getAll(),
        employeeService.getAll(),
        employeeService.getSupervisors(),
      ]);
      setTrainings(trainingsData);
      setEmployees(employeesData);
      setSupervisors(supervisorsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeTrainings = async (employeeId) => {
    try {
      const data = await employeeService.getTrainings(employeeId);
      setEmployeeTrainings(data);
    } catch (err) {
      setError('Failed to load employee trainings');
    }
  };

  const handleModalSuccess = () => {
    loadData();
    if (selectedEmployee) {
      loadEmployeeTrainings(selectedEmployee);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    loadEmployeeTrainings(employeeId);
    setMessage('');
    setMessageType('');
    setSelectedTraining('');
  };

  const handleAssignTraining = async () => {
    if (!selectedEmployee) {
      showToast('Please select an employee first', 'error');
      return;
    }
    if (!selectedTraining) {
      showToast('Please select a training to assign', 'error');
      return;
    }
    if (!selectedSupervisor) {
      showToast('Please select a supervisor', 'error');
      return;
    }

    try {
      await trainingService.assign({
        employee_id: parseInt(selectedEmployee),
        training_id: parseInt(selectedTraining),
        supervisor_id: parseInt(selectedSupervisor),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      showToast('Training assigned successfully!', 'success');
      setSelectedTraining('');
      loadEmployeeTrainings(selectedEmployee);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to assign training', 'error');
    }
  };

  const handleCompleteTraining = async (employeeId, trainingId) => {
    if (!employeeId || !trainingId) {
      showToast('Missing required information', 'error');
      return;
    }

    try {
      await trainingService.complete({
        employee_id: parseInt(employeeId),
        training_id: parseInt(trainingId),
        notes: 'Completed via employee management',
      });
      showToast('Training completed successfully!', 'success');
      loadEmployeeTrainings(employeeId);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to complete training', 'error');
    }
  };

  const handleApproveTraining = async (employeeId, trainingId) => {
    if (!employeeId || !trainingId) {
      showToast('Missing required information', 'error');
      return;
    }

    try {
      await trainingService.approve({
        employee_id: parseInt(employeeId),
        training_id: parseInt(trainingId),
        supervisor_id: currentUser?.id,
      });
      showToast('Training approved successfully!', 'success');
      loadEmployeeTrainings(employeeId);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to approve training', 'error');
    }
  };

  const showToast = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const getSelectedEmployeeName = () => {
    if (!selectedEmployee) return null;
    const emp = employees.find(e => e.id === parseInt(selectedEmployee));
    return emp ? emp.name : null;
  };

  if (loading) return <div className="loading" data-cy="training-loading">Loading trainings...</div>;
  if (error) return <div className="error" data-cy="training-error">{error}</div>;

  return (
    <div className="training-list" data-cy="training-list">
      <div className="section-header">
        <h2 data-cy="training-management-title">Training Management</h2>
        <div className="actions">
          <span className="count" data-cy="training-modules-count">Total: {trainings.length} modules</span>
        </div>
      </div>

      {message && (
        <div className={messageType === 'success' ? 'success-msg' : 'error-msg'} data-cy="training-toast">
          {message}
        </div>
      )}

      {/* Employee Selector */}
      <div className="card" style={{ marginBottom: '16px' }} data-cy="employee-selector-card">
        <h2>Select Employee for Training Actions</h2>
        <div className="form-group">
          <label>Employee *</label>
          <select
            value={selectedEmployee || ''}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
            data-cy="employee-select"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_id} - {emp.name}
              </option>
            ))}
          </select>
        </div>
        {selectedEmployee && (
          <div className="bug-note" style={{ color: '#16a34a', fontWeight: '600' }} data-cy="selected-employee-name">
            ✅ Employee selected: {getSelectedEmployeeName()}
          </div>
        )}
      </div>

      {/* Quick Actions - Assign Training (Supervisor only) */}
      {selectedEmployee && isSupervisor && (
        <div className="card" style={{ marginBottom: '16px' }} data-cy="assign-training-card">
          <h2>Assign New Training</h2>
          
          <div className="form-group">
            <label>Supervisor *</label>
            <select
              value={selectedSupervisor || ''}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              style={{ width: '100%', padding: '10px' }}
              data-cy="assign-supervisor-select"
            >
              <option value="">-- Select Supervisor --</option>
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.employee_id} - {sup.name}
                </option>
              ))}
            </select>
            <small className="bug-note" data-cy="assign-supervisor-note">⚠️ Select the supervisor who is assigning this training</small>
          </div>

          <div className="form-group">
            <label>Training Module *</label>
            <select
              value={selectedTraining || ''}
              onChange={(e) => setSelectedTraining(e.target.value)}
              style={{ width: '100%', padding: '10px' }}
              data-cy="assign-training-select"
            >
              <option value="">-- Select Training to Assign --</option>
              {trainings.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.training_name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAssignTraining}
            style={{ width: '100%' }}
            data-cy="assign-training-btn"
          >
            ➕ Assign Training
          </button>
        </div>
      )}

      {/* Current Trainings for Selected Employee */}
      {selectedEmployee && (
        <div className="card" data-cy="current-trainings-card">
          <h2 data-cy="current-trainings-title">Current Trainings for {getSelectedEmployeeName()}</h2>
          {employeeTrainings.length > 0 ? (
            <table className="data-table" data-cy="current-trainings-table">
              <thead>
                <tr>
                  <th data-cy="th-training">Training</th>
                  <th data-cy="th-status">Status</th>
                  <th data-cy="th-due-date">Due Date</th>
                  <th data-cy="th-completed">Completed</th>
                  <th data-cy="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeTrainings.map((et) => (
                  <tr key={et.id} data-cy={`training-row-${et.training_id}`}>
                    <td>{et.training_name}</td>
                    <td className={`status-${et.status}`} data-cy={`training-status-${et.training_id}`}>
                      {et.status}
                      {et.status === 'approved' && ' ✅'}
                    </td>
                    <td>{et.due_date || 'N/A'}</td>
                    <td>{et.completion_date || 'Not yet'}</td>
                    <td>
                      <div className="actions">
                        {et.status === 'assigned' && (
                          <button
                            className="btn btn-small btn-success"
                            onClick={() => handleCompleteTraining(selectedEmployee, et.training_id)}
                            data-cy={`complete-training-btn-${et.training_id}`}
                          >
                            ✅ Complete
                          </button>
                        )}
                        
                        {et.status === 'completed' && isSupervisor && (
                          <button
                            className="btn btn-small btn-warning"
                            onClick={() => handleApproveTraining(selectedEmployee, et.training_id)}
                            data-cy={`approve-training-btn-${et.training_id}`}
                          >
                            📋 Approve
                          </button>
                        )}
                        
                        {et.status === 'approved' && (
                          <span style={{ color: '#22c55e', fontWeight: '600' }} data-cy={`training-approved-${et.training_id}`}>
                            ✅ Approved
                          </span>
                        )}
                        
                        {et.status === 'rejected' && (
                          <span style={{ color: '#ef4444', fontWeight: '600' }} data-cy={`training-rejected-${et.training_id}`}>
                            ❌ Rejected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }} data-cy="no-trainings-message">
              No trainings assigned to this employee
            </p>
          )}
        </div>
      )}

      {/* All Trainings List */}
      <div className="card" data-cy="all-training-modules-card">
        <h2>All Training Modules</h2>
        <table className="data-table" data-cy="all-training-modules-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Training Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.training_name}</td>
                <td>{t.description || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TrainingAssignModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSuccess={handleModalSuccess}
        supervisors={supervisors}
      />
    </div>
  );
};

export default TrainingList;
