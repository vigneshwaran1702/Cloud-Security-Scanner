import { createContext, useContext, useState } from 'react';

const EarthPortalContext = createContext();

export function EarthPortalProvider({ children }) {
  // Check sessionStorage so once entered, the user stays entered across refreshes/direct routes
  const [isEntered, setIsEntered] = useState(() => {
    try {
      return sessionStorage.getItem('cloudguard_earth_entered') === 'true';
    } catch {
      return false;
    }
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const enterPortal = () => {
    if (isTransitioning || isEntered) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIsEntered(true);
      setIsTransitioning(false);
      try {
        sessionStorage.setItem('cloudguard_earth_entered', 'true');
      } catch {}
    }, 1100);
  };

  const resetPortal = () => {
    try {
      sessionStorage.removeItem('cloudguard_earth_entered');
    } catch {}
    setIsEntered(false);
    setIsTransitioning(false);
  };

  return (
    <EarthPortalContext.Provider
      value={{
        isEntered,
        isTransitioning,
        enterPortal,
        resetPortal
      }}
    >
      {children}
    </EarthPortalContext.Provider>
  );
}

export function useEarthPortal() {
  const context = useContext(EarthPortalContext);
  if (!context) {
    throw new Error('useEarthPortal must be used within an EarthPortalProvider');
  }
  return context;
}
