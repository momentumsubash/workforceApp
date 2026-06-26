import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';

const TrainingApprove = () => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({ employee_id: '', training_id: '', supervisor_id: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [empData, trainingData] = await Promise.all([employeeService.getAll(), trainingService.getAll()]);
      setEmployees(empData);
      setTrainings(trainingData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApprove = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await trainingService.approve({
        employee_id: parseInt(formData.employee_id),
        training_id: parseInt(formData.training_id),
        supervisor_id: formData.supervisor_id ? parseInt(formData.supervisor_id) : null,
      });
      setMessage('Training approved successfully!');
      setFormData({ employee_id: '', training_id: '', supervisor_id: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve training');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await trainingService.reject({
        employee_id: parseInt(formData.employee_id),
        training_id: parseInt(formData.training_id),
      });
      setMessage('Training rejected!');
      setFormData({ employee_id: '', training_id: '', supervisor_id: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="training-approve" data-cy="approve-form">
      <h2 data-cy="approve-form-title">Approve / Reject Training</h2>
      <div className="bug-warning" data-cy="approve-bug-warning">⚠️ BUGS: Self-approval allowed, no completion check!</div>
      {error && <div className="error-msg" data-cy="approve-form-error">{error}</div>}
      {message && <div className="success-msg" data-cy="approve-form-success">{message}</div>}
      <div className="form-group">
        <label>Employee *</label>
        <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="approve-form-employee">
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.employee_id} - {emp.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Training Module *</label>
        <select name="training_id" value={formData.training_id} onChange={handleChange} required data-cy="approve-form-training">
          <option value="">Select Training</option>
          {trainings.map((t) => (
            <option key={t.id} value={t.id}>{t.training_name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Supervisor ID (Optional)</label>
        <input type="text" name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} placeholder="Enter supervisor ID" data-cy="approve-form-supervisor" />
        <small>⚠️ BUG: Can approve own training!</small>
      </div>
      <div className="button-group">
        <button className="btn-approve" onClick={handleApprove} disabled={loading} data-cy="approve-btn">
          {loading ? 'Processing...' : '✅ Approve'}
        </button>
        <button className="btn-reject" onClick={handleReject} disabled={loading} data-cy="reject-btn">
          {loading ? 'Processing...' : '❌ Reject'}
        </button>
      </div>
    </div>
  );
};

export default TrainingApprove;
