import React, { useState, useEffect } from 'react';

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState('0');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setPoints(customer.points?.toString() || '0');
      setNotes(customer.notes || '');
    }
  }, [customer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: customer?.id,
      name,
      email,
      phone,
      points: Number(points),
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="form-group">
        <label>Customer Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Loyalty Points</label>
        <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}></textarea>
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">{customer ? 'Update Profile' : 'Register Customer'}</button>
      </div>
    </form>
  );
};

export default CustomerForm;
