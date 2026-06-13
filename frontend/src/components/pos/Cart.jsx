import React from 'react';

const Cart = ({ cartItems, onUpdateQty, onRemoveItem, onCheckout, taxRate, discount }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * discount;
  const total = subtotal + tax - discountAmount;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h3>Current Order</h3>
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">No items in order</div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => onUpdateQty(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, item.quantity + 1)}>+</button>
                <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>&times;</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button className="checkout-btn" disabled={cartItems.length === 0} onClick={onCheckout}>
        Proceed to Pay
      </button>
    </div>
  );
};

export default Cart;
