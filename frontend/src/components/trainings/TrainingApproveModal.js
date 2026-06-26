import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import employeeService from '../../services/employeeService';

const TrainingApproveModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    training_id: '',
    supervisor_id: '',
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
        setFormData({ employee_id: '', training_id: '', supervisor_id: '' });
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
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
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
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-cy="approve-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 data-cy="approve-modal-title">Approve / Reject Training</h2>
          <button className="btn-close" onClick={onClose} data-cy="approve-modal-close">✕</button>
        </div>

        <div className="modal-body">
          <div className="bug-warning" data-cy="approve-modal-bug">⚠️ BUGS: Self-approval allowed, no completion check!</div>
          {error && <div className="error-msg" data-cy="approve-modal-error">{error}</div>}
          {message && <div className="success-msg" data-cy="approve-modal-success">{message}</div>}

          <div className="form-group">
            <label>Employee *</label>
            <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="approve-modal-employee">
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
            <select name="training_id" value={formData.training_id} onChange={handleChange} required data-cy="approve-modal-training">
              <option value="">Select Training</option>
              {trainings.map((t) => (
                <option key={t.id} value={t.id}>{t.training_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Supervisor ID (Optional)</label>
            <input
              type="text"
              name="supervisor_id"
              value={formData.supervisor_id}
              onChange={handleChange}
              placeholder="Enter supervisor ID"
              data-cy="approve-modal-supervisor"
            />
            <small className="bug-note" data-cy="approve-modal-note">⚠️ BUG: Can approve own training!</small>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose} data-cy="approve-modal-cancel">Cancel</button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleApprove}
            disabled={loading}
            data-cy="approve-modal-approve"
          >
            {loading ? 'Processing...' : '✅ Approve'}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleReject}
            disabled={loading}
            data-cy="approve-modal-reject"
          >
            {loading ? 'Processing...' : '❌ Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingApproveModal;
