import axios from 'axios';
import { 
  User, 
  Skill, 
  Portfolio, 
  Certification, 
  Experience, 
  Education, 
  Review 
} from './types';
import {UserContext} from '../../store/UserProvider';
import { useContext } from 'react';
import { User } from 'lucide-react';

// Create axios instance
  const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  
  // User API
export const getUserProfile = async (userId: number): Promise<User> => {

  // const response = await api.get(`/users/${userId}`);
  // return response.data;
    return {
      username: "johndoe",
      password: "password123",
      fullName: "Muhammad D.",
      title: "Senior Full Stack Developer",
      location: "San Francisco, California",
      about: "I'm a passionate full-stack developer with over 8 years of experience building robust applications and responsive web designs. I specialize in JavaScript ecosystems including React, Node.js, and modern frontend frameworks. My approach combines technical expertise with a strong focus on user experience and business goals. I pride myself on delivering clean, maintainable code and creating innovative solutions to complex problems.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      rating: "4.8",
      completedProjects: 48,
      responseTime: "Responds in 4 hours"
    };
};


export const updateUserProfile = async (userId: number, userData: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${userId}`, userData);
  return response.data;
};

export const getUserProfiles = async (parentUserId: number): Promise<User[]> => {
  // const response = await api.get(`/users/${parentUserId}/profiles`);
  // return response.data;
  return  {
    username: "johndoe",
    password: "password123",
    fullName: "Muhammad D.",
    title: "Senior Full Stack Developer",
    location: "San Francisco, California",
    about: "I'm a passionate full-stack developer with over 8 years of experience building robust applications and responsive web designs. I specialize in JavaScript ecosystems including React, Node.js, and modern frontend frameworks. My approach combines technical expertise with a strong focus on user experience and business goals. I pride myself on delivering clean, maintainable code and creating innovative solutions to complex problems.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    rating: "4.8",
    completedProjects: 48,
    responseTime: "Responds in 4 hours"
  };
};

export const createUserProfile = async (parentUserId: number, profileData: Partial<User>): Promise<User> => {
  const response = await api.post(`/users/${parentUserId}/profiles`, profileData);
  return response.data;
};

export const switchProfileType = async (userId: number, profileType: 'freelancer' | 'client'): Promise<User> => {
  const response = await api.patch(`/users/${userId}/profile-type`, { profileType });
  return response.data;
};

// Skills API
export const getUserSkills = async (userId: number): Promise<Skill[]> => {
  const response = await api.get(`/users/${userId}/skills`);
  return response.data;
};

export const createSkill = async (skillData: Omit<Skill, 'id'>): Promise<Skill> => {
  const response = await api.post('/skills', skillData);
  return response.data;
};

export const updateSkill = async (skillId: number, skillData: Partial<Skill>): Promise<Skill> => {
  const response = await api.patch(`/skills/${skillId}`, skillData);
  return response.data;
};

export const deleteSkill = async (skillId: number): Promise<void> => {
  await api.delete(`/skills/${skillId}`);
};

// Portfolio API
export const getUserPortfolios = async (userId: number): Promise<Portfolio[]> => {
  const response = await api.get(`/users/${userId}/portfolios`);
  return response.data;
};

export const getPortfolio = async (portfolioId: number): Promise<Portfolio> => {
  const response = await api.get(`/portfolios/${portfolioId}`);
  return response.data;
};

export const createPortfolio = async (portfolioData: Omit<Portfolio, 'id'>): Promise<Portfolio> => {
  const response = await api.post('/portfolios', portfolioData);
  return response.data;
};

export const updatePortfolio = async (portfolioId: number, portfolioData: Partial<Portfolio>): Promise<Portfolio> => {
  const response = await api.patch(`/portfolios/${portfolioId}`, portfolioData);
  return response.data;
};

export const deletePortfolio = async (portfolioId: number): Promise<void> => {
  await api.delete(`/portfolios/${portfolioId}`);
};

// Certification API
export const getUserCertifications = async (userId: number): Promise<Certification[]> => {
  const response = await api.get(`/users/${userId}/certifications`);
  return response.data;
};

export const createCertification = async (certificationData: Omit<Certification, 'id'>): Promise<Certification> => {
  const response = await api.post('/certifications', certificationData);
  return response.data;
};

export const updateCertification = async (certificationId: number, certificationData: Partial<Certification>): Promise<Certification> => {
  const response = await api.patch(`/certifications/${certificationId}`, certificationData);
  return response.data;
};

export const deleteCertification = async (certificationId: number): Promise<void> => {
  await api.delete(`/certifications/${certificationId}`);
};

// Experience API
export const getUserExperiences = async (userId: number): Promise<Experience[]> => {
  const response = await api.get(`/users/${userId}/experiences`);
  return response.data;
};

export const createExperience = async (experienceData: Omit<Experience, 'id'>): Promise<Experience> => {
  const response = await api.post('/experiences', experienceData);
  return response.data;
};

export const updateExperience = async (experienceId: number, experienceData: Partial<Experience>): Promise<Experience> => {
  const response = await api.patch(`/experiences/${experienceId}`, experienceData);
  return response.data;
};

export const deleteExperience = async (experienceId: number): Promise<void> => {
  await api.delete(`/experiences/${experienceId}`);
};

// Education API
export const getUserEducations = async (userId: number): Promise<Education[]> => {
  const response = await api.get(`/users/${userId}/educations`);
  return response.data;
};

export const createEducation = async (educationData: Omit<Education, 'id'>): Promise<Education> => {
  const response = await api.post('/educations', educationData);
  return response.data;
};

export const updateEducation = async (educationId: number, educationData: Partial<Education>): Promise<Education> => {
  const response = await api.patch(`/educations/${educationId}`, educationData);
  return response.data;
};

export const deleteEducation = async (educationId: number): Promise<void> => {
  await api.delete(`/educations/${educationId}`);
};

// Review API
export const getUserReviews = async (userId: number): Promise<Review[]> => {
  const response = await api.get(`/users/${userId}/reviews`);
  return response.data;
};

export const createReview = async (reviewData: Omit<Review, 'id'>): Promise<Review> => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

// Error handler
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      return error.response.data.message || 'An error occurred with the request.';
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      return 'No response received from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      return `Request error: ${error.message}`;
    }
  }
  console.error('Unexpected error:', error);
  return 'An unexpected error occurred.';
};
