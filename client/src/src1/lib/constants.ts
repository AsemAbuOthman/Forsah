import { SkillCategory } from "./types";

// Default user ID for the application
export const DEFAULT_USER_ID = 1;

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
  "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
  "https://images.unsplash.com/photo-1573495627361-d9b87960b12d",
  "https://images.unsplash.com/photo-1606857521015-7f9fcf423740",
  "https://images.unsplash.com/photo-1601881614875-0d128922256c"
];

// Skill categories and options
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Programming Languages",
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "php", label: "PHP" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "cpp", label: "C++" },
      { value: "ruby", label: "Ruby" },
      { value: "go", label: "Go" },
      { value: "swift", label: "Swift" },
      { value: "kotlin", label: "Kotlin" },
    ]
  },
  {
    name: "Frameworks & Libraries",
    options: [
      { value: "react", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue.js" },
      { value: "nextjs", label: "Next.js" },
      { value: "nodejs", label: "Node.js" },
      { value: "express", label: "Express" },
      { value: "django", label: "Django" },
      { value: "flask", label: "Flask" },
      { value: "laravel", label: "Laravel" },
      { value: "spring", label: "Spring" },
      { value: "dotnet", label: ".NET" },
    ]
  },
  {
    name: "Databases",
    options: [
      { value: "mongodb", label: "MongoDB" },
      { value: "postgresql", label: "PostgreSQL" },
      { value: "mysql", label: "MySQL" },
      { value: "firebase", label: "Firebase" },
      { value: "sqlite", label: "SQLite" },
      { value: "redis", label: "Redis" },
      { value: "oracle", label: "Oracle" },
      { value: "mssql", label: "Microsoft SQL Server" },
    ]
  },
  {
    name: "Other",
    options: [
      { value: "aws", label: "AWS" },
      { value: "azure", label: "Azure" },
      { value: "gcp", label: "Google Cloud" },
      { value: "docker", label: "Docker" },
      { value: "kubernetes", label: "Kubernetes" },
      { value: "git", label: "Git" },
      { value: "graphql", label: "GraphQL" },
      { value: "restapi", label: "REST API" },
      { value: "cicd", label: "CI/CD" },
      { value: "agile", label: "Agile" },
      { value: "scrum", label: "Scrum" },
    ]
  }
];

export const SKILL_LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" }
];

// Color mappings for skills based on category
export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  "Programming Languages": "blue",
  "Frameworks & Libraries": "purple",
  "Databases": "green",
  "Other": "yellow"
};
