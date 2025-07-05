import { useState, useEffect } from 'react';
import { useTheme } from '../../store/ThemeContext';
import { useProfile } from '../../store/ProfileContext';
import ProfileHeader from './ProfileHeader';
import Navigation from './Navigation';
import AboutSection from './sections/AboutSection';
import PortfolioSection from './sections/PortfolioSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import CertificationsSection from './sections/CertificationsSection';
import ReviewsSection from './sections/ReviewsSection';
import ScrollToTop from './shared/ScrollToTop';

export default function Profile() {
  const { darkMode, toggleTheme } = useTheme();
  const { activeProfile } = useProfile();
  const [activeSection, setActiveSection] = useState("about");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentActiveSection = activeSection;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          currentActiveSection = section.getAttribute('id');
        }
      });
      
      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Navigation 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
      
      <div className={`h-60 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-blue-800'}`}></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12">
        <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
          <ProfileHeader />
          
          <AboutSection id="about" />
          
          {activeProfile.type === 'freelancer' && (
            <PortfolioSection id="portfolio" />
          )}
          
          <ExperienceSection id="experience" />
          <EducationSection id="education" />
          <CertificationsSection id="certifications" />
          <ReviewsSection id="reviews" />
        </div>
      </main>
      
      <ScrollToTop />
    </div>
  );
}