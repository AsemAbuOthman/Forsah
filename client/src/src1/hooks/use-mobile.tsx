import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param {number} breakpoint The pixel width at which to consider the device as mobile
 * @returns {boolean} indicating if the viewport is mobile-sized
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're running in a browser environment (not SSR)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };

      // Initial check
      checkIsMobile();

      // Add event listener for window resize
      window.addEventListener('resize', checkIsMobile);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', checkIsMobile);
      };
    }

    return undefined;
  }, [breakpoint]); // Re-run effect if breakpoint changes

  return isMobile;
}