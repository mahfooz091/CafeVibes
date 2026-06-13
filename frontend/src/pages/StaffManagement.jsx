import React, { useState } from 'react';
import StaffForm from '../components/staff/StaffForm';
import PermissionGrid from '../components/staff/PermissionGrid';
import Modal from '../components/common/Modal';

const StaffManagement = () => {
  const [editingStaff, setEditingStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rolePermissions, setRolePermissions] = useState({
    manager: { pos: true, table_layout: true, orders_list: true, menu_mgmt: true, staff_mgmt: true, analytics: true, settings: true },
    cashier: { pos: true, table_layout: true, orders_list: true, menu_mgmt: false, staff_mgmt: false, analytics: false, settings: false },
    waiter: { pos: true, table_layout: true, orders_list: true, menu_mgmt: false, staff_mgmt: false, analytics: false, settings: false },
    chef: { pos: false, table_layout: false, orders_list: true, menu_mgmt: false, staff_mgmt: false, analytics: false, settings: false }
  });

  const staffList = [
    { id: '1', name: 'Bob Johnson', email: 'bob@cafe.com', phone: '555-0101', role: 'manager', status: 'active' },
    { id: '2', name: 'Alice Smith', email: 'alice@cafe.com', phone: '555-0102', role: 'cashier', status: 'active' }
  ];

  const handleSaveStaff = (staffData) => {
    alert(`Saved staff member: ${staffData.name}`);
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleTogglePermission = (role, module) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: !prev[role][module]
      }
    }));
  };

  return (
    <div className="page-container staff-management-page">
      <div className="staff-mgmt-header">
        <h2>Staff Directory</h2>
        <button className="add-btn" onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}>Add New Staff</button>
      </div>

      <div className="management-table-wrapper">
        <table className="management-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(staff => (
              <tr key={staff.id}>
                <td>{staff.name}</td>
                <td><span className="role-tag">{staff.role.toUpperCase()}</span></td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td><span className={`status-badge ${staff.status}`}>{staff.status}</span></td>
                <td>
                  <button className="edit-btn" onClick={() => { setEditingStaff(staff); setIsModalOpen(true); }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PermissionGrid
        rolePermissions={rolePermissions}
        onTogglePermission={handleTogglePermission}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? 'Edit Staff Profile' : 'Register New Staff'}>
        <StaffForm
          staff={editingStaff}
          onSubmit={handleSaveStaff}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default StaffManagement;
