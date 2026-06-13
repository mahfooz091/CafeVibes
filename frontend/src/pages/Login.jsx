import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        handlePINSubmit(newPin);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handlePINSubmit = (enteredPin) => {
    // Basic mock authentication based on PIN
    if (enteredPin === '1234') {
      onLoginSuccess({ name: 'Manager Bob', role: 'manager' });
    } else if (enteredPin === '5555') {
      onLoginSuccess({ name: 'Cashier Alice', role: 'cashier' });
    } else {
      setError('Invalid PIN code. Try again.');
      setPin('');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">
          <h2>CafeVibes</h2>
          <p>Terminal POS Access</p>
        </div>
        <div className="pin-display">
          <div className="pin-dots">
            {[...Array(4)].map((_, i) => (
              <span key={i} className={`dot ${pin.length > i ? 'active' : ''}`}></span>
            ))}
          </div>
          {error && <p className="login-error">{error}</p>}
        </div>
        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} type="button" onClick={() => handleKeyPress(num.toString())}>
              {num}
            </button>
          ))}
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
          <button type="button" onClick={() => handleKeyPress('0')}>0</button>
          <button type="button" className="disabled-key" disabled></button>
        </div>
      </div>
    </div>
  );
};

export default Login;
