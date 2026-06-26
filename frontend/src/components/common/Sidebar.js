import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isSupervisor }) => {
  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard', cy: 'nav-dashboard' },
    { path: '/employees', label: '👥 Employees', cy: 'nav-employees' },
    { path: '/trainings', label: '📚 Trainings', cy: 'nav-trainings' },
    { path: '/certifications', label: '🎓 Certifications', cy: 'nav-certifications' },
  ];

  if (isSupervisor) {
    navItems.push({ path: '/reports', label: '📈 Reports', cy: 'nav-reports' });
  }

  return (
    <nav className="sidebar">
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
              data-cy={item.cy}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <span className="role-badge" data-cy="sidebar-role">
          {isSupervisor ? '👔 Supervisor' : '👤 Employee'}
        </span>
      </div>
    </nav>
  );
};

export default Sidebar;
