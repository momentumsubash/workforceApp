import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';

const TrainingComplete = () => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({ employee_id: '', training_id: '', notes: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const result = await trainingService.complete({
        employee_id: parseInt(formData.employee_id),
        training_id: parseInt(formData.training_id),
        notes: formData.notes,
      });
      setMessage('Training completed successfully!');
      if (result.warning) setError(`⚠️ ${result.warning}`);
      setFormData({ employee_id: '', training_id: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="training-form" onSubmit={handleSubmit} data-cy="complete-form">
      <h2 data-cy="complete-form-title">Complete Training</h2>
      <div className="bug-warning" data-cy="complete-bug-warning">⚠️ BUG: You can complete training even if not assigned!</div>
      {error && <div className="error-msg" data-cy="complete-form-error">{error}</div>}
      {message && <div className="success-msg" data-cy="complete-form-success">{message}</div>}
      <div className="form-group">
        <label>Employee *</label>
        <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="complete-form-employee">
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.employee_id} - {emp.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Training Module *</label>
        <select name="training_id" value={formData.training_id} onChange={handleChange} required data-cy="complete-form-training">
          <option value="">Select Training</option>
          {trainings.map((t) => (
            <option key={t.id} value={t.id}>{t.training_name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Add notes..." rows="3" data-cy="complete-form-notes" />
      </div>
      <button type="submit" disabled={loading} data-cy="complete-form-submit">{loading ? 'Completing...' : 'Mark Complete'}</button>
    </form>
  );
};

export default TrainingComplete;
