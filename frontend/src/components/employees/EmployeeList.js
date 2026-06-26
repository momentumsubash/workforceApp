import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';
import EmployeeModal from './EmployeeModal';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeTrainings, setEmployeeTrainings] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleModalSuccess = () => {
    loadEmployees();
  };

  const handleViewTrainings = async (employeeId) => {
    try {
      const data = await employeeService.getTrainings(employeeId);
      setEmployeeTrainings(data);
      setSelectedEmployee(employeeId);
    } catch (err) {
      alert('Failed to load trainings');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeService.delete(id);
      await loadEmployees();
      showToast('Employee deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete employee', 'error');
    }
  };

  const showToast = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="loading" data-cy="employee-list-loading">Loading employees...</div>;
  if (error) return <div className="error" data-cy="employee-list-error">{error}</div>;

  return (
    <div className="employee-list" data-cy="employee-list">
      <div className="section-header">
        <h2 data-cy="employee-list-title">Employee List</h2>
        <div className="actions">
          <span className="count" data-cy="employee-count">Total: {employees.length}</span>
          <button className="btn btn-primary btn-small" onClick={handleAddClick} data-cy="add-employee-btn">
            ➕ Add Employee
          </button>
        </div>
      </div>

      {message && (
        <div className={messageType === 'success' ? 'success-msg' : 'error-msg'} data-cy="employee-message">
          {message}
        </div>
      )}

      <table className="data-table" data-cy="employee-table">
        <thead>
          <tr>
            <th data-cy="th-employee-id">ID</th>
            <th data-cy="th-employee-name">Name</th>
            <th data-cy="th-employee-email">Email</th>
            <th data-cy="th-employee-department">Department</th>
            <th data-cy="th-employee-supervisor">Supervisor</th>
            <th data-cy="th-employee-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} data-cy={`employee-row-${emp.id}`}>
              <td>{emp.employee_id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department_name || 'Unassigned'}</td>
              <td>{emp.supervisor_name || 'Unassigned'}</td>
              <td>
                <div className="actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => handleViewTrainings(emp.id)}
                    data-cy={`view-trainings-btn-${emp.id}`}
                  >
                    📚
                  </button>
                  <button
                    className="btn btn-small btn-warning"
                    onClick={() => handleEditClick(emp)}
                    data-cy={`edit-employee-btn-${emp.id}`}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(emp.id)}
                    data-cy={`delete-employee-btn-${emp.id}`}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && employeeTrainings.length > 0 && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)} data-cy="employee-trainings-modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Trainings for Employee #{selectedEmployee}</h3>
              <button className="btn-close" onClick={() => setSelectedEmployee(null)} data-cy="employee-trainings-close">✕</button>
            </div>
            <div className="modal-body">
              <table className="data-table" data-cy="employee-trainings-table">
                <thead>
                  <tr>
                    <th>Training</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeTrainings.map((t) => (
                    <tr key={t.id}>
                      <td>{t.training_name}</td>
                      <td className={`status-${t.status}`}>{t.status}</td>
                      <td>{t.due_date || 'N/A'}</td>
                      <td>{t.completion_date || 'Not yet'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setSelectedEmployee(null)} data-cy="employee-trainings-modal-close">Close</button>
            </div>
          </div>
        </div>
      )}

      <EmployeeModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={editingEmployee}
      />
    </div>
  );
};

export default EmployeeList;
