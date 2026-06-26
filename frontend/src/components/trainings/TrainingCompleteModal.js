import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';

const TrainingCompleteModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    training_id: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialData) {
        setFormData(prev => ({ ...prev, training_id: initialData.id || '' }));
      } else {
        setFormData({ employee_id: '', training_id: '', notes: '' });
      }
      setError('');
      setMessage('');
    }
  }, [isOpen, initialData]);

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
      const result = await trainingService.complete({
        employee_id: parseInt(formData.employee_id),
        training_id: parseInt(formData.training_id),
        notes: formData.notes,
      });
      setMessage('Training completed successfully!');
      if (result.warning) setError(`⚠️ ${result.warning}`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-cy="complete-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 data-cy="complete-modal-title">Complete Training</h2>
          <button className="btn-close" onClick={onClose} data-cy="complete-modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="bug-warning" data-cy="complete-modal-bug">⚠️ BUG: You can complete training even if not assigned!</div>
            {error && <div className="error-msg" data-cy="complete-modal-error">{error}</div>}
            {message && <div className="success-msg" data-cy="complete-modal-success">{message}</div>}

            <div className="form-group">
              <label>Employee *</label>
              <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="complete-modal-employee">
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
              <select name="training_id" value={formData.training_id} onChange={handleChange} required data-cy="complete-modal-training">
                <option value="">Select Training</option>
                {trainings.map((t) => (
                  <option key={t.id} value={t.id}>{t.training_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Add notes..." rows="3" data-cy="complete-modal-notes" />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} data-cy="complete-modal-cancel">Cancel</button>
            <button type="submit" className="btn btn-success" disabled={loading} data-cy="complete-modal-submit">
              {loading ? 'Completing...' : 'Mark Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingCompleteModal;
