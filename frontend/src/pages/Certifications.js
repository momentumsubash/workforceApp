import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import certificationService from '../services/certificationService';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => { loadCertifications(); }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const data = await certificationService.getAll();
      setCertifications(data);
    } catch (err) {
      setMessage('Failed to load certifications');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const loadExpiring = async () => {
    try {
      const data = await certificationService.getExpiring();
      setCertifications(data);
      if (data.length > 0) {
        alert(`Found ${data.length} certifications expiring soon!`);
      }
    } catch (err) {
      alert('Failed to load expiring certifications');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await certificationService.delete(id);
      await loadCertifications();
      setMessage('Certification deleted');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to delete');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="loading" data-cy="certifications-loading">Loading certifications...</div>;

  return (
    <Layout title="Certifications">
      <div className="page-header" data-cy="certifications-page-header">
        <h2 data-cy="certifications-page-title">🎓 Certification Management</h2>
        <div className="actions">
          <button className="btn btn-warning btn-small" onClick={loadExpiring} data-cy="check-expiring-btn">🔔 Check Expiring</button>
          <span className="count" data-cy="certifications-count">Total: {certifications.length}</span>
        </div>
      </div>

      {message && (
        <div className={messageType === 'success' ? 'success-msg' : 'error-msg'} data-cy="certifications-message">
          {message}
        </div>
      )}

      <div className="card" data-cy="certifications-card">
        <h2 data-cy="certifications-card-title">Employee Certifications</h2>
        <p style={{ color: '#6b7280', marginBottom: '12px' }} data-cy="certifications-desc">
          Certifications are automatically created when a training is approved.
        </p>
        <table className="data-table" data-cy="certifications-table">
          <thead>
            <tr>
              <th data-cy="th-cert-employee">Employee</th>
              <th data-cy="th-cert-name">Certification</th>
              <th data-cy="th-cert-expiry">Expiry Date</th>
              <th data-cy="th-cert-days">Days Left</th>
              <th data-cy="th-cert-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => {
              const daysLeft = Math.ceil(
                (new Date(cert.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
              );
              return (
                <tr key={cert.id} data-cy={`cert-row-${cert.id}`}>
                  <td>{cert.employee_name}</td>
                  <td>{cert.certification_name}</td>
                  <td>{cert.expiry_date}</td>
                  <td className={daysLeft < 30 ? 'warning' : ''} data-cy={`cert-days-left-${cert.id}`}>
                    {daysLeft > 0 ? `${daysLeft} days` : '⚠️ Expired!'}
                  </td>
                  <td>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(cert.id)} data-cy={`delete-cert-btn-${cert.id}`}>
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="bug-note" style={{ marginTop: '12px' }} data-cy="cert-bug-note">
          ⚠️ BUG: 30-day expiry alert is off by 1 day
        </div>
      </div>
    </Layout>
  );
};

export default Certifications;
