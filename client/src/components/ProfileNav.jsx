import { useEffect, useState } from 'react';
import {
  User,
  Briefcase,
  Clock,
  GraduationCap,
  Award,
  Star,
  Menu,
  X
} from 'lucide-react';

export default function ProfileNav({ activeProfile, activeSection }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Close mobile menu when section changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [activeSection]);
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Navigation items
  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, showFor: ['freelancer'] },
    { id: 'experience', label: 'Experience', icon: Clock },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];
  
  const filteredNavItems = navItems.filter(item => !item.showFor || item.showFor.includes(activeProfile.type));
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="block md:hidden">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2"
          aria-expanded={showMobileMenu}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {filteredNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeSection === item.id 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40' 
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <item.icon size={18} className="mr-2" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Mobile navigation menu */}
      {showMobileMenu && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg z-20 md:hidden">
          <nav className="flex flex-col space-y-2">
            {filteredNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <item.icon size={18} className="mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}