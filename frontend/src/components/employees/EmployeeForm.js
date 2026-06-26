import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';

const EmployeeForm = ({ onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    department_id: '',
    supervisor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        employee_id: editData.employee_id || '',
        name: editData.name || '',
        email: editData.email || '',
        department_id: editData.department_id || '',
        supervisor: editData.supervisor || '',
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editData?.id) {
        await employeeService.update(editData.id, formData);
        setSuccess('Employee updated successfully!');
      } else {
        await employeeService.create(formData);
        setSuccess('Employee created successfully!');
      }
      setFormData({ employee_id: '', name: '', email: '', department_id: '', supervisor: '' });
      if (onSuccess) setTimeout(onSuccess, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit} data-cy="employee-form">
      <h2 data-cy="emp-form-title">{editData ? 'Edit Employee' : 'Create Employee'}</h2>
      {error && <div className="error-msg" data-cy="emp-form-error">{error}</div>}
      {success && <div className="success-msg" data-cy="emp-form-success">{success}</div>}
      <div className="form-group">
        <label>Employee ID *</label>
        <input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} required placeholder="EMP001" data-cy="emp-form-id-input" />
      </div>
      <div className="form-group">
        <label>Name *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" data-cy="emp-form-name-input" />
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" data-cy="emp-form-email-input" />
      </div>
      <div className="form-group">
        <label>Department ID</label>
        <input type="text" name="department_id" value={formData.department_id} onChange={handleChange} placeholder="1" data-cy="emp-form-dept-input" />
      </div>
      <div className="form-group">
        <label>Supervisor</label>
        <input type="text" name="supervisor" value={formData.supervisor} onChange={handleChange} placeholder="Jane Smith" data-cy="emp-form-supervisor-input" />
      </div>
      <button type="submit" disabled={loading} data-cy="emp-form-submit">
        {loading ? 'Saving...' : editData ? 'Update Employee' : 'Create Employee'}
      </button>
    </form>
  );
};

export default EmployeeForm;
