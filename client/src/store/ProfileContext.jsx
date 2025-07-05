import { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
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
    {
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
    },
    {
      id: 2,
      type: 'client',
      name: 'Sarah Johnson',
      title: 'Product Manager',
      location: 'New York, NY',
      joinDate: '2019-06-20',
      totalEarned: 0,
      rating: 3.8,
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

  // Methods to manage profile data
  const updateProfile = (updatedProfile) => {
    setActiveProfile(updatedProfile);
    setProfiles(prev => prev.map(profile => 
      profile.id === updatedProfile.id ? updatedProfile : profile
    ));
  };

  const handleProfileTypeToggle = () => {
    setActiveProfile(prev => ({
      ...prev,
      type: prev.type === 'freelancer' ? 'client' : 'freelancer'
    }));
  };

  const switchProfile = (id) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setActiveProfile(profile);
    }
  };

  // Education methods
  const addEducation = (newEducation) => {
    const id = Math.max(0, ...education.map(e => e.id)) + 1;
    setEducation(prev => [...prev, { ...newEducation, id }]);
  };

  const updateEducation = (updatedEducation) => {
    setEducation(prev => prev.map(edu => 
      edu.id === updatedEducation.id ? updatedEducation : edu
    ));
  };

  const deleteEducation = (id) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
  };

  // Certification methods
  const addCertification = (newCertification) => {
    const id = Math.max(0, ...certifications.map(c => c.id)) + 1;
    setCertifications(prev => [...prev, { ...newCertification, id }]);
  };

  const updateCertification = (updatedCertification) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === updatedCertification.id ? updatedCertification : cert
    ));
  };

  const deleteCertification = (id) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  // Experience methods
  const addExperience = (newExperience) => {
    const id = Math.max(0, ...experience.map(e => e.id)) + 1;
    setExperience(prev => [...prev, { ...newExperience, id }]);
  };

  const updateExperience = (updatedExperience) => {
    setExperience(prev => prev.map(exp => 
      exp.id === updatedExperience.id ? updatedExperience : exp
    ));
  };

  const deleteExperience = (id) => {
    setExperience(prev => prev.filter(exp => exp.id !== id));
  };

  // Portfolio methods
  const addPortfolio = (newPortfolio) => {
    const id = Math.max(0, ...portfolios.map(p => p.id)) + 1;
    setPortfolios(prev => [...prev, { ...newPortfolio, id }]);
  };

  const updatePortfolio = (updatedPortfolio) => {
    setPortfolios(prev => prev.map(portfolio => 
      portfolio.id === updatedPortfolio.id ? updatedPortfolio : portfolio
    ));
  };

  const deletePortfolio = (id) => {
    setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
  };

  return (
    <ProfileContext.Provider value={{
      activeProfile,
      profiles,
      portfolios,
      reviews,
      education,
      certifications,
      experience,
      updateProfile,
      handleProfileTypeToggle,
      switchProfile,
      addEducation,
      updateEducation,
      deleteEducation,
      addCertification,
      updateCertification,
      deleteCertification,
      addExperience,
      updateExperience,
      deleteExperience,
      addPortfolio,
      updatePortfolio,
      deletePortfolio
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}