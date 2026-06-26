import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';

const TrainingAssign = () => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({ employee_id: '', training_id: '', due_date: '' });
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
      await trainingService.assign(formData);
      setMessage('Training assigned successfully!');
      setFormData({ employee_id: '', training_id: '', due_date: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="training-form" onSubmit={handleSubmit} data-cy="assign-form">
      <h2 data-cy="assign-form-title">Assign Training</h2>
      {error && <div className="error-msg" data-cy="assign-form-error">{error}</div>}
      {message && <div className="success-msg" data-cy="assign-form-success">{message}</div>}
      <div className="form-group">
        <label>Employee *</label>
        <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="assign-form-employee">
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.employee_id} - {emp.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Training Module *</label>
        <select name="training_id" value={formData.training_id} onChange={handleChange} required data-cy="assign-form-training">
          <option value="">Select Training</option>
          {trainings.map((t) => (
            <option key={t.id} value={t.id}>{t.training_name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} data-cy="assign-form-due-date" />
      </div>
      <button type="submit" disabled={loading} data-cy="assign-form-submit">{loading ? 'Assigning...' : 'Assign Training'}</button>
    </form>
  );
};

export default TrainingAssign;
