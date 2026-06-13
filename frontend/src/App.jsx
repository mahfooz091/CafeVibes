import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Login from './pages/Login';
import POS from './pages/POS';
import TableManagement from './pages/TableManagement';
import Orders from './pages/Orders';
import MenuManagement from './pages/MenuManagement';
import StaffManagement from './pages/StaffManagement';
import CustomerManagement from './pages/CustomerManagement';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  const [activeStaff, setActiveStaff] = useState(null);
  const [currentTab, setCurrentTab] = useState('pos');

  const handleLogin = (staff) => {
    setActiveStaff(staff);
  };

  const handleLogout = () => {
    setActiveStaff(null);
  };

  if (!activeStaff) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'pos':
        return <POS />;
      case 'tables':
        return <TableManagement />;
      case 'orders':
        return <Orders />;
      case 'menu':
        return <MenuManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <POS />;
    }
  };

  const getTitle = () => {
    switch (currentTab) {
      case 'pos': return 'POS Terminal';
      case 'tables': return 'Table Layout & Dine-in';
      case 'orders': return 'Orders List & Status';
      case 'menu': return 'Menu Management';
      case 'staff': return 'Staff Directory & Access';
      case 'customers': return 'Customer Database & Loyalty';
      case 'dashboard': return 'Analytics & Reports';
      case 'settings': return 'System Settings';
      default: return 'CafeVibes POS';
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      <div className="main-content-wrapper">
        <Header title={getTitle()} activeStaff={activeStaff} onLogout={handleLogout} />
        <main className="page-content">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;

