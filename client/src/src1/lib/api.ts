import axios from 'axios';
import { 
  User, 
  Skill, 
  Portfolio, 
  Certification, 
  Experience, 
  Education, 
  Review, 
  SkillCategory
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

  const response = await api.get(`/users/${userId}`); 
  return  response.data.user as User;
};


export const updateUserProfile = async (userId: number, userData: Partial<User>): Promise<User> => {
  console.log(userData);
  const response = await api.patch(`/users/${userId}`, userData);
  console.log(response.data.user);
  
  return response.data.user as User;
};

// export const getUserProfiles = async (parentUserId: number): Promise<User[]> => {
//   const response = await api.get(`/users/${parentUserId}/profiles`);
//   return response.data;
// };

export const createUserProfile = async (userId: number, profileData: Partial<User>): Promise<User> => {
  const response = await api.post(`/users/${userId}/profiles`, profileData);
  return response.data;
};

export const switchProfileType = async (userId: number, profileType: 'freelancer' | 'client'): Promise<User> => {
  const response = await api.patch(`/users/${userId}/profile-type`, { profileType });
  return response.data;

};

export const getCategoriesWithSkills = async (): Promise<SkillCategory[]> => {
  const response = await api.get(`/categoriesWithSkills`);

  console.log(response.data);

  return response.data.data as SkillCategory[];
};

// Skills API
export const getUserSkills = async (userId: number): Promise<Skill[]> => {
  const response = await api.get(`/users/${userId}/skills`);
  return response.data.skills as Skill[];
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
  return response.data.portfolios as Portfolio[];

};

export const getPortfolio = async (portfolioId: number): Promise<Portfolio> => {
  const response = await api.get(`/portfolios/${portfolioId}`);
  return response.data.portfolios as Portfolio;
};

export const createPortfolio = async (portfolioData: Omit<Portfolio, 'id'>): Promise<Portfolio[]> => {
  
  console.log('portfolio : ', portfolioData);

  const response = await api.post(`/users/${portfolioData.userId}/portfolios`, portfolioData);

  console.log('response.data.portfolios : ', response.data.portfolios);

  return response.data.portfolios as Portfolio[];
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
  return response.data.certifications as Certification[];
};

export const createCertification = async (certificationData: Omit<Certification, 'id'>): Promise<Certification[]> => {
  const response = await api.post('/certification', certificationData);
  return response.data.certifications as Certification[];
};

export const updateCertification = async (certificationId: number, certificationData: Partial<Certification>): Promise<Certification[]> => {
  const response = await api.patch(`/certification/${certificationId}`, certificationData);
  return response.data.certifications as Certification[];
};

export const deleteCertification = async (certificationId: number): Promise<void> => {
  const response = await api.delete(`/certification/${certificationId}`);
  return response.data.certifications;
};

// Experience API
export const getUserExperiences = async (userId: number): Promise<Experience[]> => {
  const response = await api.get(`/users/${userId}/experiences`);
  return response.data.experiences as Experience[];
};

export const createExperience = async (experienceData: Omit<Experience, 'id'>): Promise<Experience[]> => {

  console.log('experienceData : ', experienceData);
  
  const response = await api.post('/experience', experienceData);
  return response.data.experiences as Experience[];
};

export const updateExperience = async (experienceId: number, experienceData: Partial<Experience>): Promise<Experience[]> => {
  console.log('experienceData : ', experienceData);


  const response = await api.patch(`/experience/${experienceId}`, experienceData);
  return response.data.certifications as Experience[];
};

export const deleteExperience = async (experienceId: number): Promise<void> => {
  console.log('experienceId : ', experienceId);


  const response = await api.delete(`/experience/${experienceId}`);
  return response.data.Experience;
};

// Education API
export const getUserEducations = async (userId: number): Promise<Education[]> => {
  const response = await api.get(`/users/${userId}/educations`);
  return response.data.educations as Education[];

};

export const createEducation = async (educationData: Omit<Education, 'id'>): Promise<Education[]> => {
  const response = await api.post('/education', educationData);
  return response.data.educations as Education[];
};

export const updateEducation = async (educationId: number, educationData: Partial<Education>): Promise<Education[]> => {
  const response = await api.patch(`/education/${educationId}`, educationData);
  return response.data.educations as Education[];
};

export const deleteEducation = async (educationId: number): Promise<void> => {
  const response = await api.delete(`/education/${educationId}`);
  return response.data.educations;
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
