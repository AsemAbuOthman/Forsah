import { 
  users, type User, type InsertUser,
  skills, type Skill, type InsertSkill,
  portfolios, type Portfolio, type InsertPortfolio,
  certifications, type Certification, type InsertCertification,
  experiences, type Experience, type InsertExperience,
  educations, type Education, type InsertEducation,
  reviews, type Review, type InsertReview
} from "./schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserProfiles(parentUserId: number): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  createUserProfile(parentUserId: number, profile: Partial<User>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  switchProfileType(id: number, profileType: string): Promise<User | undefined>;
  
  // Skills methods
  getUserSkills(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<Skill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Portfolio methods
  getUserPortfolios(userId: number): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<Portfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;
  
  // Certification methods
  getUserCertifications(userId: number): Promise<Certification[]>;
  getCertification(id: number): Promise<Certification | undefined>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: number, certification: Partial<Certification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<boolean>;
  
  // Experience methods
  getUserExperiences(userId: number): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<Experience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Education methods
  getUserEducations(userId: number): Promise<Education[]>;
  getEducation(id: number): Promise<Education | undefined>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: Partial<Education>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Review methods
  getUserReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private skills: Map<number, Skill>;
  private portfolios: Map<number, Portfolio>;
  private certifications: Map<number, Certification>;
  private experiences: Map<number, Experience>;
  private educations: Map<number, Education>;
  private reviews: Map<number, Review>;
  
  private userId: number;
  private skillId: number;
  private portfolioId: number;
  private certificationId: number;
  private experienceId: number;
  private educationId: number;
  private reviewId: number;

  constructor() {
    this.users = new Map();
    this.skills = new Map();
    this.portfolios = new Map();
    this.certifications = new Map();
    this.experiences = new Map();
    this.educations = new Map();
    this.reviews = new Map();
    
    this.userId = 1;
    this.skillId = 1;
    this.portfolioId = 1;
    this.certificationId = 1;
    this.experienceId = 1;
    this.educationId = 1;
    this.reviewId = 1;
    
    // Initialize with a demo user
    this.createUser({
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
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserProfiles(parentUserId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.parentUserId === parentUserId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      about: insertUser.about || null,
      avatar: insertUser.avatar || null,
      rating: insertUser.rating || null,
      completedProjects: insertUser.completedProjects || null,
      responseTime: insertUser.responseTime || null,
      profileType: insertUser.profileType || "freelancer",
      isActiveProfile: insertUser.isActiveProfile !== undefined ? insertUser.isActiveProfile : true,
      parentUserId: insertUser.parentUserId || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async createUserProfile(parentUserId: number, profile: Partial<User>): Promise<User> {
    const parentUser = await this.getUser(parentUserId);
    if (!parentUser) {
      throw new Error("Parent user not found");
    }
    
    // Make current active profiles inactive
    if (profile.isActiveProfile) {
      const existingProfiles = await this.getUserProfiles(parentUserId);
      for (const existing of existingProfiles) {
        if (existing.isActiveProfile) {
          await this.updateUser(existing.id, { isActiveProfile: false });
        }
      }
      
      // Also make parent inactive if needed
      if (parentUser.isActiveProfile) {
        await this.updateUser(parentUserId, { isActiveProfile: false });
      }
    }
    
    const id = this.userId++;
    const newProfile: User = {
      id,
      username: parentUser.username + "_" + (profile.profileType || "client"),
      password: parentUser.password,
      fullName: profile.fullName || parentUser.fullName,
      title: profile.title || (profile.profileType === "client" ? "Client" : "Freelancer"),
      location: profile.location || parentUser.location,
      about: profile.about || null,
      avatar: profile.avatar || parentUser.avatar,
      rating: profile.rating || null,
      completedProjects: profile.completedProjects || null,
      responseTime: profile.responseTime || null,
      profileType: profile.profileType || "client",
      isActiveProfile: profile.isActiveProfile !== undefined ? profile.isActiveProfile : true,
      parentUserId: parentUserId
    };
    
    this.users.set(id, newProfile);
    return newProfile;
  }
  
  async switchProfileType(id: number, profileType: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, profileType };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Skills methods
  async getUserSkills(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId
    );
  }
  
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.skillId++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }
  
  async updateSkill(id: number, skillData: Partial<Skill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;
    
    const updatedSkill = { ...skill, ...skillData };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Portfolio methods
  async getUserPortfolios(userId: number): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId
    );
  }
  
  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }
  
  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.portfolioId++;
    const portfolio: Portfolio = { 
      ...insertPortfolio, 
      id,
      images: typeof insertPortfolio.images === 'string' 
        ? JSON.parse(insertPortfolio.images) 
        : insertPortfolio.images || null,
      technologies: typeof insertPortfolio.technologies === 'string' 
        ? JSON.parse(insertPortfolio.technologies) 
        : insertPortfolio.technologies || null,
      projectUrl: insertPortfolio.projectUrl || null
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }
  
  async updatePortfolio(id: number, portfolioData: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    // Handle the images and technologies arrays
    let imagesParsed = portfolioData.images;
    if (typeof portfolioData.images === 'string') {
      imagesParsed = JSON.parse(portfolioData.images);
    }
    
    let technologiesParsed = portfolioData.technologies;
    if (typeof portfolioData.technologies === 'string') {
      technologiesParsed = JSON.parse(portfolioData.technologies);
    }
    
    const updatedPortfolio = { 
      ...portfolio, 
      ...portfolioData,
      images: imagesParsed !== undefined ? imagesParsed : portfolio.images,
      technologies: technologiesParsed !== undefined ? technologiesParsed : portfolio.technologies
    };
    
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }
  
  async deletePortfolio(id: number): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Certification methods
  async getUserCertifications(userId: number): Promise<Certification[]> {
    return Array.from(this.certifications.values()).filter(
      (certification) => certification.userId === userId
    );
  }
  
  async getCertification(id: number): Promise<Certification | undefined> {
    return this.certifications.get(id);
  }
  
  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const id = this.certificationId++;
    const certification: Certification = { 
      ...insertCertification, 
      id,
      expiryDate: insertCertification.expiryDate || null,
      certificateImage: insertCertification.certificateImage || null,
      certificateUrl: insertCertification.certificateUrl || null 
    };
    this.certifications.set(id, certification);
    return certification;
  }
  
  async updateCertification(id: number, certificationData: Partial<Certification>): Promise<Certification | undefined> {
    const certification = this.certifications.get(id);
    if (!certification) return undefined;
    
    const updatedCertification = { ...certification, ...certificationData };
    this.certifications.set(id, updatedCertification);
    return updatedCertification;
  }
  
  async deleteCertification(id: number): Promise<boolean> {
    return this.certifications.delete(id);
  }

  // Experience methods
  async getUserExperiences(userId: number): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(
      (experience) => experience.userId === userId
    );
  }
  
  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }
  
  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.experienceId++;
    const experience: Experience = { 
      ...insertExperience, 
      id,
      description: insertExperience.description || null,
      endDate: insertExperience.endDate || null,
      current: insertExperience.current !== undefined ? insertExperience.current : null
    };
    this.experiences.set(id, experience);
    return experience;
  }
  
  async updateExperience(id: number, experienceData: Partial<Experience>): Promise<Experience | undefined> {
    const experience = this.experiences.get(id);
    if (!experience) return undefined;
    
    const updatedExperience = { ...experience, ...experienceData };
    this.experiences.set(id, updatedExperience);
    return updatedExperience;
  }
  
  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Education methods
  async getUserEducations(userId: number): Promise<Education[]> {
    return Array.from(this.educations.values()).filter(
      (education) => education.userId === userId
    );
  }
  
  async getEducation(id: number): Promise<Education | undefined> {
    return this.educations.get(id);
  }
  
  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const id = this.educationId++;
    const education: Education = { 
      ...insertEducation, 
      id,
      description: insertEducation.description || null,
      endYear: insertEducation.endYear || null
    };
    this.educations.set(id, education);
    return education;
  }
  
  async updateEducation(id: number, educationData: Partial<Education>): Promise<Education | undefined> {
    const education = this.educations.get(id);
    if (!education) return undefined;
    
    const updatedEducation = { ...education, ...educationData };
    this.educations.set(id, updatedEducation);
    return updatedEducation;
  }
  
  async deleteEducation(id: number): Promise<boolean> {
    return this.educations.delete(id);
  }

  // Review methods
  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review: Review = { 
      ...insertReview, 
      id,
      reviewerAvatar: insertReview.reviewerAvatar || null
    };
    this.reviews.set(id, review);
    return review;
  }
}

export const storage = new MemStorage();
