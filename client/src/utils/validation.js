import { z } from 'zod';
import validator from 'validator';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title is too long'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location is too long'),
  about: z.string().min(10, 'About section must be at least 10 characters').max(1000, 'About section is too long'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  image: z.string().url('Invalid image URL')
});

export const portfolioSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  duration: z.string().optional(),
  client: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required')
});

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title is too long'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name is too long'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location is too long'),
  startDate: z.string().refine(val => validator.isDate(val), 'Invalid start date'),
  endDate: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long')
});

export const educationSchema = z.object({
  degree: z.string().min(2, 'Degree must be at least 2 characters').max(100, 'Degree is too long'),
  institution: z.string().min(2, 'Institution must be at least 2 characters').max(100, 'Institution is too long'),
  year: z.string().regex(/^\d{4}$/, 'Invalid year format'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long')
});

export const certificationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  issuer: z.string().min(2, 'Issuer must be at least 2 characters').max(100, 'Issuer is too long'),
  date: z.string().refine(val => validator.isDate(val), 'Invalid date'),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional()
});

export function validateImageFile(file) {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return errors;
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('File must be an image (JPEG, PNG, GIF, or WebP)');
  }

  return errors;
}

export function validateImageUrl(url) {
  if (!url) return 'Image URL is required';
  
  try {
    new URL(url);
    return null;
  } catch (e) {
    return 'Invalid image URL';
  }
}

export function validateDate(date, field = 'Date') {
  if (!date) return `${field} is required`;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Invalid ${field.toLowerCase()}`;
  }
  
  return null;
}

export function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  if (end && start > end) {
    return 'Start date must be before end date';
  }
  
  return null;
}