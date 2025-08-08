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

export interface Skill {
  id: string;
  name: string;
  level: string;
  icon: string;
  category: string;
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
