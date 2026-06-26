import React, { useState, useEffect } from 'react';
import certificationService from '../../services/certificationService';
import employeeService from '../../services/employeeService';

const CertificationForm = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ employee_id: '', certification_name: '', expiry_date: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
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
      await certificationService.create({
        employee_id: parseInt(formData.employee_id),
        certification_name: formData.certification_name,
        expiry_date: formData.expiry_date,
      });
      setMessage('Certification assigned successfully!');
      setFormData({ employee_id: '', certification_name: '', expiry_date: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="cert-form" onSubmit={handleSubmit} data-cy="cert-form">
      <h2 data-cy="cert-form-title">Assign Certification</h2>
      {error && <div className="error-msg" data-cy="cert-form-error">{error}</div>}
      {message && <div className="success-msg" data-cy="cert-form-success">{message}</div>}
      <div className="form-group">
        <label>Employee *</label>
        <select name="employee_id" value={formData.employee_id} onChange={handleChange} required data-cy="cert-form-employee">
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.employee_id} - {emp.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Certification Name *</label>
        <input type="text" name="certification_name" value={formData.certification_name} onChange={handleChange} required placeholder="AWS Certified Solutions Architect" data-cy="cert-form-name" />
      </div>
      <div className="form-group">
        <label>Expiry Date *</label>
        <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required data-cy="cert-form-expiry" />
      </div>
      <button type="submit" disabled={loading} data-cy="cert-form-submit">{loading ? 'Assigning...' : 'Assign Certification'}</button>
    </form>
  );
};

export default CertificationForm;
