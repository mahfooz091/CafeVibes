import React from 'react';

const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    { id: 'pos', label: 'POS Terminal', icon: '🛒' },
    { id: 'tables', label: 'Table Layout', icon: '🍽️' },
    { id: 'orders', label: 'Orders List', icon: '📋' },
    { id: 'menu', label: 'Menu Mgmt', icon: '☕' },
    { id: 'staff', label: 'Staff Mgmt', icon: '👥' },
    { id: 'customers', label: 'Customers', icon: '👤' },
    { id: 'dashboard', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>CafeVibes</h2>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
