import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [activeStaff, setActiveStaff] = useState(null);

  const login = (staffProfile) => {
    setActiveStaff(staffProfile);
  };

  const logout = () => {
    setActiveStaff(null);
  };

  return (
    <AuthContext.Provider value={{ activeStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
