import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
