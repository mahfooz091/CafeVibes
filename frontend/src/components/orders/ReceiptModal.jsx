import React from 'react';
import Modal from '../common/Modal';

const ReceiptModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const { id, type, table, items, subtotal, tax, discount, total, timestamp } = order;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Receipt - #${id}`}>
      <div className="receipt-container">
        <div className="receipt-header">
          <h3>CafeVibes</h3>
          <p>123 Coffee Lane, Espresso City</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="receipt-meta">
          <div><strong>Order Type:</strong> {type.toUpperCase()}</div>
          {table && <div><strong>Table:</strong> {table}</div>}
          <div><strong>Date:</strong> {new Date(timestamp).toLocaleString()}</div>
        </div>
        <div className="receipt-divider">--------------------------------</div>
        <div className="receipt-items-list">
          {items.map((item, idx) => (
            <div key={idx} className="receipt-item-line">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="receipt-divider">--------------------------------</div>
        <div className="receipt-totals">
          <div className="total-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="total-line">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="total-line">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="total-line receipt-grand-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="receipt-footer">
          <p>Thank you for visiting CafeVibes!</p>
          <p>Please come again.</p>
        </div>
        <button className="print-btn" onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
