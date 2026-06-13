import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('pos');

  return (
    <AppContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
