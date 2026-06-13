import React, { useState } from 'react';
import CustomerForm from '../components/customers/CustomerForm';
import Modal from '../components/common/Modal';

const CustomerManagement = () => {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customers = [
    { id: '1', name: 'John Doe', email: 'john@gmail.com', phone: '555-9999', visits: 12, spend: 180.50, points: 180, notes: 'Prefers soy milk' },
    { id: '2', name: 'Jane Miller', email: 'jane@yahoo.com', phone: '555-8888', visits: 5, spend: 75.00, points: 75, notes: 'Always orders takeaway' }
  ];

  const handleSaveCustomer = (customerData) => {
    alert(`Saved customer: ${customerData.name}`);
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="page-container customer-management-page">
      <div className="customer-mgmt-header">
        <h2>Customer Database</h2>
        <button className="add-btn" onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}>Register Customer</button>
      </div>

      <div className="management-table-wrapper">
        <table className="management-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Visits</th>
              <th>Total Spend</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust.id}>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.email || 'N/A'}</td>
                <td>{cust.visits}</td>
                <td>${cust.spend.toFixed(2)}</td>
                <td><span className="points-badge">{cust.points} pts</span></td>
                <td>
                  <button className="edit-btn" onClick={() => { setEditingCustomer(cust); setIsModalOpen(true); }}>Edit / Notes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? 'Edit Customer Profile' : 'Register Customer'}>
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSaveCustomer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CustomerManagement;
