import { useContext, useEffect } from "react";
import { SkillCategory } from "./types";
import {getCategoriesWithSkills} from './api'

// Default user ID for the application
export const DEFAULT_USER_ID = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') || '{}').userId[0] : -1;

// Image placeholder URLs
export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
export const DEFAULT_PORTFOLIO_IMAGE = "https://images.unsplash.com/photo-1552581234-26160f608093";
export const DEFAULT_CERTIFICATION_IMAGE = "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2";
export const DEFAULT_REVIEWER_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d";

export const HEADSHOT_IMAGES = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", 
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
];

export const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1552581234-26160f608093",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  "https://images.unsplash.com/photo-1634937916546-9bbc39818c90",
  "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7",
  "https://images.unsplash.com/photo-1587440871875-191322ee64b0",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
  "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea"
];

export const CERTIFICATE_IMAGES = [
  "https://img.freepik.com/premium-photo/bestseller-badge-3d-badge-3d-illustration_118019-6434.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid&w=740",
];

export let SKILL_CATEGORIES: SkillCategory[] = [];

// Call immediately (but this has limitations)
getCategoriesWithSkills().then(data => {
  SKILL_CATEGORIES = data;
});

export const SKILL_LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" }
];

// Color mappings for skills based on category
export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "blue",
  "Graphic Design": "purple",
  "Writing & Translation": "green",
  "Digital Marketing": "orange",
  "Video & Animation": "amber",
  "Mobile App Development": "purple",
  "Data Science & AI": "blue",
  "Customer Support": "green",
  "Business & Finance": "green",
  "Game Development": "yellow",
  "Other": "yellow"
};
