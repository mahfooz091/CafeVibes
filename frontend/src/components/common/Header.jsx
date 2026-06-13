import React from 'react';

const Header = ({ title, activeStaff, onLogout }) => {
  return (
    <header className="header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        {activeStaff ? (
          <div className="staff-profile">
            <span className="staff-role-badge">{activeStaff.role}</span>
            <span className="staff-name">{activeStaff.name}</span>
            <button className="logout-btn" onClick={onLogout}>Lock</button>
          </div>
        ) : (
          <span className="no-staff-alert">Not Logged In</span>
        )}
      </div>
    </header>
  );
};

export default Header;
