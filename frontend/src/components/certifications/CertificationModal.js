import React, { useState, useEffect } from 'react';
import certificationService from '../../services/certificationService';
import employeeService from '../../services/employeeService';

const CertificationModal = ({ isOpen, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    certification_name: '',
    expiry_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
      setFormData({ employee_id: '', certification_name: '', expiry_date: '' });
      setError('');
      setMessage('');
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
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
      await certificationService.create({
        employee_id: parseInt(formData.employee_id),
        certification_name: formData.certification_name,
        expiry_date: formData.expiry_date,
      });
      setMessage('Certification assigned successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-cy="cert-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 data-cy="cert-modal-title">Assign Certification</h2>
          <button className="btn-close" onClick={onClose} data-cy="cert-modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-msg" data-cy="cert-modal-error">{error}</div>}
            {message && <div className="success-msg" data-cy="cert-modal-success">{message}</div>}

            <div className="form-group">
              <label>Employee *</label>
              <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="cert-modal-employee">
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_id} - {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Certification Name *</label>
              <input
                type="text"
                name="certification_name"
                value={formData.certification_name}
                onChange={handleChange}
                required
                placeholder="AWS Certified Solutions Architect"
                data-cy="cert-modal-name"
              />
            </div>

            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
                data-cy="cert-modal-expiry"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} data-cy="cert-modal-cancel">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} data-cy="cert-modal-submit">
              {loading ? 'Assigning...' : 'Assign Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;
