import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Camera,
  Pencil,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  User,
  Users,
  ChevronDown,
  X,
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  ArrowUp,
  Moon,
  Sun
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import PortfolioGallery from './portfolio/PortfolioGallery';
import Modal from './common/Modal';
import ConfirmModal from './common/ConfirmModal';
import ProfileNav from './ProfileNav';
import ScrollToTop from './common/ScrollToTop';
import { useScrollSpy } from '../hooks/useScrollSpy';

// Import profile section components
import AboutSection from './sections/AboutSection';
import PortfolioSection from './sections/PortfolioSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import CertificationsSection from './sections/CertificationsSection';
import ReviewsSection from './sections/ReviewsSection';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { showSuccessToast, showErrorToast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  const [activeProfile, setActiveProfile] = useState({
    id: 1,
    type: 'freelancer',
    name: 'Alex Thompson',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    joinDate: '2020-01-15',
    totalEarned: 150000,
    rating: 4.9,
    totalReviews: 47,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    about: "Passionate full-stack developer with 8+ years of experience in building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL']
  });

  const [profiles, setProfiles] = useState([
    activeProfile,
    {
      id: 2,
      type: 'client',
      name: 'Sarah Johnson',
      title: 'Product Manager',
      location: 'New York, NY',
      joinDate: '2019-06-20',
      totalEarned: 0,
      rating: 4.8,
      totalReviews: 15,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      about: "Product Manager with a focus on delivering high-quality software solutions.",
      skills: ['Project Management', 'Agile', 'Product Strategy']
    }
  ]);

  const [portfolios, setPortfolios] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React and Node.js. Implemented features including product management, cart functionality, and payment processing.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      duration: "3 months",
      client: "TechCorp Inc.",
      images: [
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: 2,
      title: "Fitness Tracking App",
      description:
        "Designed and developed a mobile-first fitness tracking application with workout planning and progress monitoring features.",
      technologies: ["React Native", "Firebase", "TypeScript"],
      duration: "4 months",
      client: "FitTech Solutions",
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]
    }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "John Smith",
      rating: 5,
      comment: "Excellent work! Delivered the project ahead of schedule and exceeded expectations.",
      date: "2024-03-15",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectTitle: "E-commerce Platform"
    },
    {
      id: 2,
      name: "Emily Brown",
      rating: 5,
      comment: "Very professional and great communication throughout the project. Would definitely hire again!",
      date: "2024-03-10",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      projectTitle: "Fitness Tracking App"
    }
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "Master's in Computer Science",
      institution: "Stanford University",
      year: "2018",
      description: "Specialized in Distributed Systems and Machine Learning"
    },
    {
      id: 2,
      degree: "Bachelor's in Software Engineering",
      institution: "University of California, Berkeley",
      year: "2016",
      description: "Focus on Web Technologies and Algorithms"
    }
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2020-06",
      expiryDate: "2023-06",
      credentialId: "AWS-123456"
    },
    {
      id: 2,
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2021-03",
      credentialId: "PSM-789012"
    }
  ]);

  const [experience, setExperience] = useState([
    {
      id: 1,
      title: "Senior Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      startDate: "2020-01",
      description: "Led a team of 5 developers in building enterprise-level applications."
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "StartupX",
      location: "San Francisco, CA",
      startDate: "2018-03",
      endDate: "2019-12",
      description: "Developed and maintained multiple client projects using modern web technologies."
    }
  ]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const fileInputRef = useRef(null);

  // Get active section based on scroll position
  const sections = ['about', 'portfolio', 'experience', 'education', 'certifications', 'reviews'];
  const activeSection = useScrollSpy(sections, { offset: 100 });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // File size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast("Image too large. Please select an image under 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setActiveProfile(prev => ({
          ...prev,
          image: reader.result
        }));
        showSuccessToast("Profile picture updated successfully");
      };
      reader.onerror = () => {
        showErrorToast("Failed to read file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileTypeToggle = () => {
    setActiveProfile(prev => ({
      ...prev,
      type: prev.type === 'freelancer' ? 'client' : 'freelancer'
    }));
    showSuccessToast(`Switched to ${activeProfile.type === 'freelancer' ? 'client' : 'freelancer'} profile`);
  };

  const showDeleteConfirmation = (itemType, id, title) => {
    setConfirmTitle(`Delete ${itemType}`);
    setConfirmMessage(`Are you sure you want to delete "${title}"? This action cannot be undone.`);
    setConfirmAction(() => () => {
      switch (itemType) {
        case 'education':
          setEducation(prev => prev.filter(item => item.id !== id));
          break;
        case 'certification':
          setCertifications(prev => prev.filter(item => item.id !== id));
          break;
        case 'experience':
          setExperience(prev => prev.filter(item => item.id !== id));
          break;
        case 'portfolio':
          setPortfolios(prev => prev.filter(item => item.id !== id));
          break;
        default:
          return;
      }
      showSuccessToast(`${itemType} deleted successfully`);
    });
    setShowConfirmModal(true);
  };

  return (
    <div className="transition-colors duration-200">
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-30 transition-colors duration-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ProfileNav 
              activeProfile={activeProfile}
              activeSection={activeSection}
            />
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              <button
                onClick={handleProfileTypeToggle}
                className="btn-secondary flex items-center space-x-2"
              >
                <Users size={18} />
                <span className="hidden sm:inline">{activeProfile.type === 'freelancer' ? 'Switch to Client' : 'Switch to Freelancer'}</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 h-60 transition-colors duration-200"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
          {/* Profile Section */}
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <div className="relative mx-auto md:mx-0">
                <img
                  src={activeProfile.image}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Change profile picture"
                >
                  <Camera size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              
              <div className="mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{activeProfile.name}</h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">{activeProfile.title}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin size={18} className="mr-1" />
                    <span>{activeProfile.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar size={18} className="mr-1" />
                    <span>Joined {format(new Date(activeProfile.joinDate), 'MMM yyyy')}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-900 dark:text-white font-semibold">{activeProfile.rating}</span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">({activeProfile.totalReviews} reviews)</span>
                  </div>
                  {activeProfile.type === 'freelancer' && (
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span className="font-semibold">${activeProfile.totalEarned.toLocaleString()}</span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400">earned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <AboutSection 
            activeProfile={activeProfile}
            setActiveProfile={setActiveProfile}
            showSuccessToast={showSuccessToast}
          />

          {/* Portfolio Section */}
          {activeProfile.type === 'freelancer' && (
            <PortfolioSection 
              portfolios={portfolios}
              setPortfolios={setPortfolios}
              showDeleteConfirmation={showDeleteConfirmation}
              showSuccessToast={showSuccessToast}
              showErrorToast={showErrorToast}
            />
          )}

          {/* Experience Section */}
          <ExperienceSection
            experience={experience}
            setExperience={setExperience}
            showDeleteConfirmation={showDeleteConfirmation}
            showSuccessToast={showSuccessToast}
          />

          {/* Education Section */}
          <EducationSection
            education={education}
            setEducation={setEducation}
            showDeleteConfirmation={showDeleteConfirmation}
            showSuccessToast={showSuccessToast}
          />

          {/* Certifications Section */}
          <CertificationsSection
            certifications={certifications}
            setCertifications={setCertifications}
            showDeleteConfirmation={showDeleteConfirmation}
            showSuccessToast={showSuccessToast}
          />

          {/* Reviews Section */}
          <ReviewsSection reviews={reviews} />
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction();
            setShowConfirmModal(false);
          }
        }}
        title={confirmTitle}
        message={confirmMessage}
      />

      {/* Profile Edit Modal */}
      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              
              // Basic validation
              if (!activeProfile.name) {
                showErrorToast("Name is required");
                return;
              }
              
              if (!activeProfile.title) {
                showErrorToast("Title is required");
                return;
              }
              
              if (!activeProfile.about) {
                showErrorToast("About section is required");
                return;
              }
              
              // Update profiles list with the edited profile
              setProfiles(prevProfiles => {
                return prevProfiles.map(profile => 
                  profile.id === activeProfile.id ? activeProfile : profile
                );
              });
              
              setShowProfileModal(false);
              showSuccessToast("Profile updated successfully");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={activeProfile.name}
                onChange={(e) =>
                  setActiveProfile({ ...activeProfile, name: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={activeProfile.title}
                onChange={(e) =>
                  setActiveProfile({ ...activeProfile, title: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                value={activeProfile.location}
                onChange={(e) =>
                  setActiveProfile({ ...activeProfile, location: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</label>
              <input
                type="date"
                value={activeProfile.joinDate}
                onChange={(e) =>
                  setActiveProfile({ ...activeProfile, joinDate: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">About</label>
              <textarea
                value={activeProfile.about}
                onChange={(e) =>
                  setActiveProfile({ ...activeProfile, about: e.target.value })
                }
                rows={4}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma separated)</label>
              <input
                type="text"
                value={activeProfile.skills.join(', ')}
                onChange={(e) =>
                  setActiveProfile({
                    ...activeProfile,
                    skills: e.target.value.split(',').map((skill) => skill.trim()).filter(Boolean),
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image URL</label>
              <input
                type="text"
                value={activeProfile.image}
                onChange={(e) =>
                  setActiveProfile({ ...activeProfile, image: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <img
                src={activeProfile.image}
                alt="Profile Preview"
                className="w-24 h-24 mt-4 rounded-full object-cover border dark:border-gray-700"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}