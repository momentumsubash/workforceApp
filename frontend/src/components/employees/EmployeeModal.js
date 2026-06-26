import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';

const EmployeeModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    department_id: '',
    supervisor_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadDepartmentsAndSupervisors();
      if (editData) {
        setFormData({
          employee_id: editData.employee_id || '',
          name: editData.name || '',
          email: editData.email || '',
          department_id: editData.department_id || '',
          supervisor_id: editData.supervisor_id || '',
        });
      } else {
        setFormData({ employee_id: '', name: '', email: '', department_id: '', supervisor_id: '' });
      }
      setError('');
      setSuccess('');
    }
  }, [isOpen, editData]);

  const loadDepartmentsAndSupervisors = async () => {
    try {
      const deptResponse = await fetch('http://localhost:3001/api/departments');
      const deptData = await deptResponse.json();
      setDepartments(Array.isArray(deptData) ? deptData : []);

      const supResponse = await fetch('http://localhost:3001/api/employees/supervisors');
      const supData = await supResponse.json();
      setSupervisors(Array.isArray(supData) ? supData : []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setDepartments([]);
      setSupervisors([]);
    }
  };

  if (!isOpen) return null;

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
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-cy="employee-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 data-cy="employee-modal-title">{editData ? 'Edit Employee' : 'Create Employee'}</h2>
          <button className="btn-close" onClick={onClose} data-cy="employee-modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-msg" data-cy="employee-modal-error">{error}</div>}
            {success && <div className="success-msg" data-cy="employee-modal-success">{success}</div>}

            <div className="form-group">
              <label>Employee ID *</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
                placeholder="EMP001"
                data-cy="employee-id-input"
              />
            </div>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                data-cy="employee-name-input"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@workforcepro.com"
                data-cy="employee-email-input"
              />
              
            </div>

            <div className="form-group">
              <label>Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                data-cy="employee-department-select"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Supervisor</label>
              <select
                name="supervisor_id"
                value={formData.supervisor_id}
                onChange={handleChange}
                data-cy="employee-supervisor-select"
              >
                <option value="">Select Supervisor</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name} ({sup.employee_id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} data-cy="employee-modal-cancel">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} data-cy="employee-modal-submit">
              {loading ? 'Saving...' : editData ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
