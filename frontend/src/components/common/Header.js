import React from 'react';

const Header = ({ title, user, isSupervisor, onLogout }) => {
  const userRole = isSupervisor ? '👔 Supervisor' : '👤 Employee';

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 data-cy="app-title">🔧 {title || 'WorkForcePro'}</h1>
        <div className="header-actions">
          <span className="status-badge" data-cy="api-status">🟢 API Connected</span>
          {user && (
            <span className="user-badge" data-cy="user-badge">
              {userRole} | {user.name} ({user.employee_id})
            </span>
          )}
          <button className="logout-btn" onClick={onLogout} data-cy="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
