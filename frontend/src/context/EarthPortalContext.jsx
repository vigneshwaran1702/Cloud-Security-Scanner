import { createContext, useContext, useState, useEffect } from 'react';

const EarthPortalContext = createContext();

export function EarthPortalProvider({ children }) {
  const [isEntered, setIsEntered] = useState(() => {
    // Check if user has already entered in this session
    const saved = sessionStorage.getItem('cloudguard_earth_entered');
    return saved === 'true';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const enterPortal = () => {
    if (isTransitioning || isEntered) return;
    setIsTransitioning(true);
    // Smooth transition delay so particle shockwave completes before overlay removes
    setTimeout(() => {
      setIsEntered(true);
      setIsTransitioning(false);
      sessionStorage.setItem('cloudguard_earth_entered', 'true');
    }, 1100);
  };

  const resetPortal = () => {
    sessionStorage.removeItem('cloudguard_earth_entered');
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
