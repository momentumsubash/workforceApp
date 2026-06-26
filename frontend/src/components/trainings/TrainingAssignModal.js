import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';

const TrainingAssignModal = ({ isOpen, onClose, onSuccess, supervisors }) => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    training_id: '',
    supervisor_id: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFormData({ employee_id: '', training_id: '', supervisor_id: '', due_date: '' });
      setError('');
      setMessage('');
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [empData, trainingData] = await Promise.all([
        employeeService.getAll(),
        trainingService.getAll(),
      ]);
      setEmployees(empData);
      setTrainings(trainingData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await trainingService.assign({
        employee_id: parseInt(formData.employee_id),
        training_id: parseInt(formData.training_id),
        supervisor_id: parseInt(formData.supervisor_id),
        due_date: formData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setMessage('Training assigned successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-cy="training-assign-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 data-cy="assign-modal-title">Assign Training</h2>
          <button className="btn-close" onClick={onClose} data-cy="assign-modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-msg" data-cy="assign-modal-error">{error}</div>}
            {message && <div className="success-msg" data-cy="assign-modal-success">{message}</div>}

            <div className="form-group">
              <label>Employee *</label>
              <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="assign-modal-employee">
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_id} - {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Training Module *</label>
              <select name="training_id" value={formData.training_id} onChange={handleChange} required data-cy="assign-modal-training">
                <option value="">Select Training</option>
                {trainings.map((t) => (
                  <option key={t.id} value={t.id}>{t.training_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Supervisor *</label>
              <select name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} required data-cy="assign-modal-supervisor">
                <option value="">Select Supervisor</option>
                {supervisors && supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.employee_id} - {sup.name}
                  </option>
                ))}
              </select>
              <small className="bug-note" data-cy="assign-modal-note">⚠️ Only supervisors can assign training</small>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} data-cy="assign-modal-due-date" />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} data-cy="assign-modal-cancel">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} data-cy="assign-modal-submit">
              {loading ? 'Assigning...' : 'Assign Training'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingAssignModal;
