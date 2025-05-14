// Type definitions for the frontend application

export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  locationUrl: string;
  companyName: string;
  languageId: number;
  currencyId: number;
  countryId: number;
  zipCode: number;
  city: string;
  dateOfBirth: Date;
  isActive: boolean;
  roleId: number;
  createdAt: Date;
  language: string;
  symbol: string;
  countryName: string;
  profileId: number;
  profileDescription: string;
  imageId: number;
  imageUrl: string;
  phone: number;
  profileType?: 'freelancer' | 'client';
  professionalTitle: string;
  hourlyRate: number
}

export interface Skill {
  userSkillId: number;
  userId: number;
  categoryName: string;
  categoryDescription: string;
  categoryId: number;
  skillName: string;
  skillId: string;
  level: "Beginner" | "Intermediate" | "Expert";
}

export interface PortfolioImage {
  url: string;
  alt: string;
}

//portfolioId	userId	sampleProjectId	portfolioId	sampleProjectTitle	sampleProjectDescription	completionDate	sampleProjectUrl	sampleProjectSkillId	sampleProjectId	skillId	imageId	imageUrl	imageableId	imageableType	createdAt	skillId	categoryId	skillName
export interface Portfolio {
  portfolioId: number;
  sampleProjectId: number;
  userId: number;
  sampleProjectTitle: string;
  sampleProjectDescription: string;
  imageUrl: images;
  completionDate: Date; // ISO date string
  sampleProjectUrl: string; // ISO date string
  sampleProjectSkillId: number[]  ; // ISO date string
  skillId: number[]; // ISO date string
  skillName: string[]; // ISO date string
  categoryId: number[]; // ISO date string
  categoryName: string[]; // ISO date string
  imageableId: number[]; // ISO date string
  imageableType: string; // ISO date string
  technologies: string[];
  projectUrl?: string;
}

export interface images {
  imageId: number;
  imageUrl: string;
}

// certificationId	userId	certificationTitle	certificationOrganization	startDate	endDate	certificationUrl

export interface Certification {
  certificationId: number;
  userId: number;
  certificationTitle: string;
  certificationOrganization: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  certificateImage?: string;
  certificationUrl?: string;
}

// experienceId	userId	experienceTitle	experienceDescription	experienceCompanyName	countryId	startDate	endDate

export interface Experience {
  experienceId: number;
  userId: number;
  experienceTitle: string;
  experienceCompanyName: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  experienceDescription?: string;
  current: boolean;
}

// educationId	userId	educationDegree	educationOrganization	startDate	endDate	countryId educationDescription

export interface Education {
  educationId: number;
  userId: number;
  educationDegree: string;
  educationOrganization: string;
  startDate: string;
  endDate?: string;
  educationDescription?: string;
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
export interface SkillOption {
  value: string;
  label: string;
}

export interface SkillCategory {
  name: string;
  options: SkillOption[];
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
