import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // This hook gets the current location (URL)
  const { pathname } = useLocation();

  // This hook runs every time the 'pathname' changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

export default ScrollToTop;