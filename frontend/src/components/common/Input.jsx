import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        {...props}
      />
    </div>
  );
};

export default Input;
