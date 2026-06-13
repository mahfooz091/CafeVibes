import React, { useState } from 'react';
import Modal from '../common/Modal';

const PaymentModal = ({ isOpen, onClose, total, onCompletePayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState('');

  const change = receivedAmount ? Math.max(0, Number(receivedAmount) - total) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'cash' && Number(receivedAmount) < total) {
      alert('Received amount is less than total price');
      return;
    }
    onCompletePayment({
      method: paymentMethod,
      received: paymentMethod === 'cash' ? Number(receivedAmount) : total,
      change: paymentMethod === 'cash' ? change : 0
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Payment Method">
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-total-display">
          <span>Amount Payable:</span>
          <h2>${total.toFixed(2)}</h2>
        </div>
        <div className="payment-methods-grid">
          {['cash', 'card', 'mobile'].map((method) => (
            <button
              key={method}
              type="button"
              className={`payment-method-btn ${paymentMethod === method ? 'active' : ''}`}
              onClick={() => setPaymentMethod(method)}
            >
              {method.toUpperCase()}
            </button>
          ))}
        </div>
        {paymentMethod === 'cash' && (
          <div className="cash-inputs">
            <div className="input-group">
              <label>Amount Received</label>
              <input
                type="number"
                step="0.01"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="change-display">
              <span>Change:</span>
              <h3>${change.toFixed(2)}</h3>
            </div>
          </div>
        )}
        <div className="payment-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="confirm-btn">Complete Payment</button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
