import React, { useState, useEffect } from 'react';

const StaffForm = ({ staff, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('cashier');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (staff) {
      setName(staff.name || '');
      setEmail(staff.email || '');
      setPhone(staff.phone || '');
      setRole(staff.role || 'cashier');
      setPin(''); // Keep PIN input blank for security when editing
      setStatus(staff.status || 'active');
    }
  }, [staff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: staff?.id,
      name,
      email,
      phone,
      role,
      ...(pin && { pin }), // Only include PIN if it was filled out
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="staff-form">
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
          </select>
        </div>
        <div className="form-group">
          <label>Access PIN (4 digits)</label>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder={staff ? 'Leave blank to keep same' : 'e.g. 1234'}
            required={!staff}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">{staff ? 'Update Staff' : 'Add Staff'}</button>
      </div>
    </form>
  );
};

export default StaffForm;
