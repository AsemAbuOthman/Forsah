import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertSkillSchema, 
  insertPortfolioSchema, 
  insertCertificationSchema, 
  insertExperienceSchema, 
  insertEducationSchema, 
  insertReviewSchema 
} from "./schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });
  
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const userData = req.body;
    const updatedUser = await storage.updateUser(userId, userData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  });
  
  app.get("/api/users/:id/profiles", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const profiles = await storage.getUserProfiles(userId);
    res.json(profiles);
  });
  
  app.post("/api/users/:id/profiles", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const profileData = req.body;
    try {
      const newProfile = await storage.createUserProfile(userId, profileData);
      res.status(201).json(newProfile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.patch("/api/users/:id/profile-type", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const { profileType } = req.body;
    if (!profileType || (profileType !== 'freelancer' && profileType !== 'client')) {
      return res.status(400).json({ message: "Invalid profile type. Must be 'freelancer' or 'client'" });
    }
    
    const updatedUser = await storage.switchProfileType(userId, profileType);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  });
  
  // Skills routes
  app.get("/api/users/:id/skills", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const skills = await storage.getUserSkills(userId);
    res.json(skills);
  });
  
  app.post("/api/skills", async (req: Request, res: Response) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data", error });
    }
  });
  
  app.patch("/api/skills/:id", async (req: Request, res: Response) => {
    const skillId = parseInt(req.params.id);
    if (isNaN(skillId)) {
      return res.status(400).json({ message: "Invalid skill ID" });
    }
    
    const skillData = req.body;
    const updatedSkill = await storage.updateSkill(skillId, skillData);
    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    
    res.json(updatedSkill);
  });
  
  app.delete("/api/skills/:id", async (req: Request, res: Response) => {
    const skillId = parseInt(req.params.id);
    if (isNaN(skillId)) {
      return res.status(400).json({ message: "Invalid skill ID" });
    }
    
    const success = await storage.deleteSkill(skillId);
    if (!success) {
      return res.status(404).json({ message: "Skill not found" });
    }
    
    res.status(204).end();
  });
  
  // Portfolio routes
  app.get("/api/users/:id/portfolios", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const portfolios = await storage.getUserPortfolios(userId);
    res.json(portfolios);
  });
  
  app.post("/api/portfolios", async (req: Request, res: Response) => {
    try {
      const portfolioData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(portfolioData);
      res.status(201).json(portfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data", error });
    }
  });
  
  app.get("/api/portfolios/:id", async (req: Request, res: Response) => {
    const portfolioId = parseInt(req.params.id);
    if (isNaN(portfolioId)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }
    
    const portfolio = await storage.getPortfolio(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    
    res.json(portfolio);
  });
  
  app.patch("/api/portfolios/:id", async (req: Request, res: Response) => {
    const portfolioId = parseInt(req.params.id);
    if (isNaN(portfolioId)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }
    
    const portfolioData = req.body;
    const updatedPortfolio = await storage.updatePortfolio(portfolioId, portfolioData);
    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    
    res.json(updatedPortfolio);
  });
  
  app.delete("/api/portfolios/:id", async (req: Request, res: Response) => {
    const portfolioId = parseInt(req.params.id);
    if (isNaN(portfolioId)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }
    
    const success = await storage.deletePortfolio(portfolioId);
    if (!success) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    
    res.status(204).end();
  });
  
  // Certification routes
  app.get("/api/users/:id/certifications", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const certifications = await storage.getUserCertifications(userId);
    res.json(certifications);
  });
  
  app.post("/api/certifications", async (req: Request, res: Response) => {
    try {
      const certificationData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(certificationData);
      res.status(201).json(certification);
    } catch (error) {
      res.status(400).json({ message: "Invalid certification data", error });
    }
  });
  
  app.patch("/api/certifications/:id", async (req: Request, res: Response) => {
    const certificationId = parseInt(req.params.id);
    if (isNaN(certificationId)) {
      return res.status(400).json({ message: "Invalid certification ID" });
    }
    
    const certificationData = req.body;
    const updatedCertification = await storage.updateCertification(certificationId, certificationData);
    if (!updatedCertification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    
    res.json(updatedCertification);
  });
  
  app.delete("/api/certifications/:id", async (req: Request, res: Response) => {
    const certificationId = parseInt(req.params.id);
    if (isNaN(certificationId)) {
      return res.status(400).json({ message: "Invalid certification ID" });
    }
    
    const success = await storage.deleteCertification(certificationId);
    if (!success) {
      return res.status(404).json({ message: "Certification not found" });
    }
    
    res.status(204).end();
  });
  
  // Experience routes
  app.get("/api/users/:id/experiences", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const experiences = await storage.getUserExperiences(userId);
    res.json(experiences);
  });
  
  app.post("/api/experiences", async (req: Request, res: Response) => {
    try {
      const experienceData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(experienceData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data", error });
    }
  });
  
  app.patch("/api/experiences/:id", async (req: Request, res: Response) => {
    const experienceId = parseInt(req.params.id);
    if (isNaN(experienceId)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }
    
    const experienceData = req.body;
    const updatedExperience = await storage.updateExperience(experienceId, experienceData);
    if (!updatedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    
    res.json(updatedExperience);
  });
  
  app.delete("/api/experiences/:id", async (req: Request, res: Response) => {
    const experienceId = parseInt(req.params.id);
    if (isNaN(experienceId)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }
    
    const success = await storage.deleteExperience(experienceId);
    if (!success) {
      return res.status(404).json({ message: "Experience not found" });
    }
    
    res.status(204).end();
  });
  
  // Education routes
  app.get("/api/users/:id/educations", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const educations = await storage.getUserEducations(userId);
    res.json(educations);
  });
  
  app.post("/api/educations", async (req: Request, res: Response) => {
    try {
      const educationData = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(educationData);
      res.status(201).json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data", error });
    }
  });
  
  app.patch("/api/educations/:id", async (req: Request, res: Response) => {
    const educationId = parseInt(req.params.id);
    if (isNaN(educationId)) {
      return res.status(400).json({ message: "Invalid education ID" });
    }
    
    const educationData = req.body;
    const updatedEducation = await storage.updateEducation(educationId, educationData);
    if (!updatedEducation) {
      return res.status(404).json({ message: "Education not found" });
    }
    
    res.json(updatedEducation);
  });
  
  app.delete("/api/educations/:id", async (req: Request, res: Response) => {
    const educationId = parseInt(req.params.id);
    if (isNaN(educationId)) {
      return res.status(400).json({ message: "Invalid education ID" });
    }
    
    const success = await storage.deleteEducation(educationId);
    if (!success) {
      return res.status(404).json({ message: "Education not found" });
    }
    
    res.status(204).end();
  });
  
  // Review routes
  app.get("/api/users/:id/reviews", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const reviews = await storage.getUserReviews(userId);
    res.json(reviews);
  });
  
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
