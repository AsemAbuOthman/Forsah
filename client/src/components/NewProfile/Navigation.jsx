import { User, Briefcase, Clock, GraduationCap, Award, Star, Sun, Moon, Users, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useProfile } from '../../store/ProfileContext';

export default function Navigation({ activeSection, scrollToSection, darkMode, toggleTheme }) {
  const { activeProfile, handleProfileTypeToggle, profiles, switchProfile } = useProfile();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Navigation items
  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, showFor: ['freelancer'] },
    { id: 'experience', label: 'Experience', icon: Clock },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Make navigation sticky after scrolling past hero section
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 210; // Height of hero - some offset
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled 
        ? (darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md') 
        : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto">
            {navItems
              .filter(item => !item.showFor || item.showFor.includes(activeProfile.type))
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center overflow-x-auto space-x-1 w-full pb-2">
            {navItems
              .filter(item => !item.showFor || item.showFor.includes(activeProfile.type))
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link flex-shrink-0 ${activeSection === item.id ? 'active' : ''}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <div className="flex flex-col items-center justify-center">
                    <item.icon size={16} />
                    <span className="text-xs mt-1">{item.label}</span>
                  </div>
                </button>
              ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={handleProfileTypeToggle}
              className="btn-secondary flex items-center space-x-2"
            >
              <Users size={18} />
              <span className="hidden sm:inline">{activeProfile.type === 'freelancer' ? 'Switch to Client' : 'Switch to Freelancer'}</span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="btn-secondary flex items-center space-x-2"
              >
                <User size={18} />
                <span className="hidden sm:inline">Switch Profile</span>
                <ChevronDown size={16} />
              </button>
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {profiles.map(profile => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          switchProfile(profile.id);
                          setShowProfileDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        } ${activeProfile.id === profile.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <img 
                            src={profile.image} 
                            alt={profile.name}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                          />
                          <div>
                            <p className="font-medium">{profile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {profile.type.charAt(0).toUpperCase() + profile.type.slice(1)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}