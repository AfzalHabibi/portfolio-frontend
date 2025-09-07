export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  images: string[];
  videos?: string[];
  mainImage: string;
  demoUrl?: string;
  githubUrl?: string;
  clientRemarks?: string;
  category: string;
  completedDate: string;
}

export interface SkillItem {
  _id?: string;
  name: string;
  keywords: string[];
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  experience: string;
  description: string;
  projects: string[];
  certifications: string[];
  tools_used: string[];
  best_practices: string[];
  achievements: string[];
  version?: string;
  methodologies: string[];
  performance_metrics: string[];
  used_in_roles: string[];
  difficulty_handled?: string;
  endorsements: string[];
  icon?: string;
  color?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface Skill {
  _id?: string;
  id?: string;
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  items: SkillItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillData {
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  items?: Omit<SkillItem, '_id'>[];
}

export interface DirectSkillData {
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  items: Omit<SkillItem, '_id'>[];
}

export interface UpdateSkillData extends Partial<CreateSkillData> {
  isActive?: boolean;
  displayOrder?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  avatar?: string;
  rating: number;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;  
}

export interface SiteSettings {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
    behance: string;
    dribbble: string;
  };
  cvUrl: string;
}
