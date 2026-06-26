import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import authService from '../../services/authService';

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isSupervisor = authService.isSupervisor();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <Header 
        title={title} 
        user={user} 
        isSupervisor={isSupervisor}
        onLogout={handleLogout}
      />
      <div className="app-body">
        <Sidebar isSupervisor={isSupervisor} />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;