import { pgTable, text, serial, integer, boolean, date, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  about: text("about"),
  avatar: text("avatar"),
  rating: text("rating"),
  completedProjects: integer("completed_projects"),
  responseTime: text("response_time"),
  profileType: text("profile_type").default("freelancer"), // "freelancer" or "client"
  isActiveProfile: boolean("is_active_profile").default(true),
  parentUserId: integer("parent_user_id"), // For multiple profiles under the same user
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  name: text("name").notNull(),
  level: text("level").notNull(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  images: text("images"),
  technologies: text("technologies"),
  completedDate: date("completed_date").notNull(),
  projectUrl: text("project_url")
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date"),
  certificateImage: text("certificate_image"),
  certificateUrl: text("certificate_url")
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  company: text("company").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: text("description"),
  current: boolean("current").default(false)
});

export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  startYear: text("start_year").notNull(),
  endYear: text("end_year"),
  description: text("description"),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reviewer: text("reviewer").notNull(),
  reviewerAvatar: text("reviewer_avatar"),
  rating: text("rating").notNull(),
  comment: text("comment").notNull(),
  date: date("date").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertPortfolioSchema = createInsertSchema(portfolios).omit({ id: true });
export const insertCertificationSchema = createInsertSchema(certifications).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experiences).omit({ id: true });
export const insertEducationSchema = createInsertSchema(educations).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type Review = typeof reviews.$inferSelect;
