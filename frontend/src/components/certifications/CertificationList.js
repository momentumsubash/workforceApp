import React, { useState, useEffect } from 'react';
import certificationService from '../../services/certificationService';
import CertificationModal from './CertificationModal';

const CertificationList = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const data = await certificationService.getAll();
      setCertifications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const loadExpiring = async () => {
    try {
      setLoading(true);
      const data = await certificationService.getExpiring();
      setCertifications(data);
      setError(null);
      if (data.length > 0) {
        alert(`Found ${data.length} certifications expiring soon!`);
      }
    } catch (err) {
      setError('Failed to load expiring certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await certificationService.delete(id);
      await loadCertifications();
      setMessage('Certification deleted successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to delete certification');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleModalSuccess = () => {
    loadCertifications();
  };

  if (loading) return <div className="loading" data-cy="cert-list-loading">Loading certifications...</div>;
  if (error) return <div className="error" data-cy="cert-list-error">{error}</div>;

  return (
    <div className="cert-list" data-cy="cert-list">
      <div className="section-header">
        <h2 data-cy="cert-list-title">Certifications</h2>
        <div className="actions">
          <button className="btn btn-warning btn-small" onClick={loadExpiring} data-cy="cert-list-check-expiring">
            🔔 Check Expiring
          </button>
          <button className="btn btn-primary btn-small" onClick={() => setShowModal(true)} data-cy="add-cert-btn">
            ➕ Add Certification
          </button>
          <span className="count" data-cy="cert-list-count">Total: {certifications.length}</span>
        </div>
      </div>

      {message && (
        <div className={messageType === 'success' ? 'success-msg' : 'error-msg'} data-cy="cert-list-message">
          {message}
        </div>
      )}

      <table className="data-table" data-cy="cert-list-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Certification</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((cert) => {
            const daysLeft = Math.ceil(
              (new Date(cert.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
            );
            return (
              <tr key={cert.id}>
                <td>{cert.employee_name}</td>
                <td>{cert.certification_name}</td>
                <td>{cert.expiry_date}</td>
                <td className={daysLeft < 30 ? 'warning' : ''}>
                  {daysLeft > 0 ? `${daysLeft} days` : '⚠️ Expired!'}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(cert.id)}
                      data-cy={`cert-list-delete-${cert.id}`}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="bug-note" data-cy="cert-list-bug">
        ⚠️ BUG: 30-day expiry alert is off by 1 day!
      </div>

      <CertificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CertificationList;
