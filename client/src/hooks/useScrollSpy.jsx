import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds, options = {}) {
  const [activeSection, setActiveSection] = useState(null);
  const { offset = 100 } = options;

  useEffect(() => {
    const handleScroll = () => {
      // Find all section elements
      const sections = sectionIds.map(id => {
        const element = document.getElementById(id);
        if (element) {
          // Get the position relative to the viewport
          const rect = element.getBoundingClientRect();
          return {
            id,
            top: rect.top - offset,
            bottom: rect.bottom - offset
          };
        }
        return null;
      }).filter(Boolean);

      // Find the first section that is currently visible in the viewport
      const currentSection = sections.find(section => {
        // If the section's top edge is above the viewport's bottom edge and 
        // the section's bottom edge is below the viewport's top edge
        return section.top < window.innerHeight && section.bottom > 0;
      });

      // If we found a visible section, and either there's no active section yet
      // or the visible section is different from the active one, update the state
      if (currentSection && (!activeSection || currentSection.id !== activeSection)) {
        setActiveSection(currentSection.id);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check for active section
    handleScroll();

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, activeSection, offset]);

  return activeSection;
}