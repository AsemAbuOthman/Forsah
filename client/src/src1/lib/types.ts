// Type definitions for the frontend application

export interface User {
  id: number;
  username: string;
  fullName: string;
  title: string;
  location: string;
  about: string;
  avatar: string;
  rating: string;
  completedProjects: number;
  responseTime: string;
  profileType?: 'freelancer' | 'client';
  isActiveProfile?: boolean;
  parentUserId?: number;
}

export interface Skill {
  id: number;
  userId: number;
  category: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Expert";
}

export interface PortfolioImage {
  url: string;
  alt: string;
}

export interface Portfolio {
  id: number;
  userId: number;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  completedDate: string; // ISO date string
  projectUrl?: string;
}

export interface Certification {
  id: number;
  userId: number;
  title: string;
  issuer: string;
  issueDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  certificateImage?: string;
  certificateUrl?: string;
}

export interface Experience {
  id: number;
  userId: number;
  title: string;
  company: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
  current: boolean;
}

export interface Education {
  id: number;
  userId: number;
  degree: string;
  institution: string;
  startYear: string;
  endYear?: string;
  description?: string;
}

export interface Review {
  id: number;
  userId: number;
  reviewer: string;
  reviewerAvatar?: string;
  rating: string;
  comment: string;
  date: string; // ISO date string
}

// Skill categories and options
export interface SkillCategory {
  name: string;
  options: SkillOption[];
}

export interface SkillOption {
  value: string;
  label: string;
}

// Modal types
export type ModalType = 
  | 'editProfile'
  | 'editAbout'
  | 'editPortfolio'
  | 'viewPortfolio'
  | 'editCertification'
  | 'viewCertification'
  | 'editExperience'
  | 'editEducation'
  | 'editSkills'
  | 'switchProfile'
  | 'createProfile';

export interface ModalData {
  portfolio?: Portfolio;
  certification?: Certification;
  experience?: Experience;
  education?: Education;
  skill?: Skill;
  skillCategory?: string;
  user?: User;
  profileType?: 'freelancer' | 'client';
  profiles?: User[];
}
