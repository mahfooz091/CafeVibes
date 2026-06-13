import React from 'react';

const PermissionGrid = ({ rolePermissions, onTogglePermission }) => {
  const roles = ['manager', 'cashier', 'waiter', 'chef'];
  const modules = ['pos', 'table_layout', 'orders_list', 'menu_mgmt', 'staff_mgmt', 'analytics', 'settings'];

  return (
    <div className="permission-grid-container">
      <h3>Role Permissions Setup</h3>
      <table className="permission-table">
        <thead>
          <tr>
            <th>Module</th>
            {roles.map(role => (
              <th key={role}>{role.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map(module => (
            <tr key={module}>
              <td><strong>{module.replace('_', ' ').toUpperCase()}</strong></td>
              {roles.map(role => {
                const hasPermission = rolePermissions[role]?.[module] || false;
                return (
                  <td key={role} className="text-center">
                    <input
                      type="checkbox"
                      checked={hasPermission}
                      onChange={() => onTogglePermission(role, module)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionGrid;
