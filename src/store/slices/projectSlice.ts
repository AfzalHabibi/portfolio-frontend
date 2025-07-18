import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
}

// Hardcoded project data - will be replaced with API data later
const hardcodedProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution built with MERN stack featuring user authentication, payment integration, and admin dashboard.',
    longDescription: 'This comprehensive e-commerce platform provides a complete online shopping experience with modern UI/UX design. Built using React.js for the frontend, Node.js and Express.js for the backend, and MongoDB for data storage. The platform includes features like user registration and authentication, product catalog management, shopping cart functionality, secure payment processing through Stripe, order management, and a comprehensive admin dashboard for managing products, orders, and users.',
    features: [
      'User Authentication & Authorization',
      'Product Catalog with Search & Filters',
      'Shopping Cart & Wishlist',
      'Secure Payment Integration (Stripe)',
      'Order Management System',
      'Admin Dashboard',
      'Responsive Design',
      'Email Notifications',
      'Inventory Management',
      'Customer Reviews & Ratings'
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Bootstrap'],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ],
    mainImage: 'https://thumbs.dreamstime.com/b/abstract-design-website-hero-section-background-features-vibrant-blue-fluid-lines-geometric-shapes-circles-351935047.jpg',
    demoUrl: 'https://demo-ecommerce.com',
    githubUrl: 'https://github.com/username/ecommerce',
    clientRemarks: 'Excellent work! The platform exceeded our expectations with its clean design and robust functionality. The admin dashboard is particularly impressive.',
    category: 'Web Development',
    completedDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking.',
    longDescription: 'A comprehensive task management solution designed for teams and individuals to organize, track, and collaborate on projects efficiently. The application features real-time synchronization, allowing team members to see updates instantly. Built with React.js and Socket.io for real-time functionality, with a Node.js backend and MongoDB database. The app includes project boards, task assignments, deadline tracking, file attachments, and team communication features.',
    features: [
      'Real-time Collaboration',
      'Project Boards & Task Cards',
      'Team Member Management',
      'Deadline Tracking & Notifications',
      'File Attachments',
      'Activity Timeline',
      'Custom Labels & Categories',
      'Progress Tracking',
      'Mobile Responsive Design',
      'Export & Reporting Features'
    ],
    technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Express', 'Material-UI'],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ],
    mainImage: '',
    demoUrl: 'https://demo-taskmanager.com',
    githubUrl: 'https://github.com/username/taskmanager',
    clientRemarks: 'The real-time collaboration features work flawlessly. Our team productivity has increased significantly since implementing this solution.',
    category: 'Web Development',
    completedDate: '2023-12-10'
  },
  {
    id: '3',
    title: 'Restaurant Mobile App',
    description: 'A React Native mobile application for restaurant ordering with menu browsing, cart management, and payment processing.',
    longDescription: 'A feature-rich mobile application developed using React Native for cross-platform compatibility. The app provides customers with an intuitive interface to browse restaurant menus, customize orders, manage their cart, and complete secure payments. Integration with restaurant POS systems ensures real-time menu updates and order processing. The app includes user profiles, order history, loyalty programs, and push notifications for order updates.',
    features: [
      'Cross-platform Mobile App (iOS & Android)',
      'Menu Browsing with Categories',
      'Order Customization',
      'Shopping Cart Management',
      'Secure Payment Processing',
      'User Profile & Order History',
      'Push Notifications',
      'Loyalty Program Integration',
      'GPS Location Services',
      'Offline Mode Support'
    ],
    technologies: ['React Native', 'Redux', 'Firebase', 'Stripe', 'Google Maps API'],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ],
    mainImage: '',
    demoUrl: 'https://demo-restaurant-app.com',
    githubUrl: 'https://github.com/username/restaurant-app',
    clientRemarks: 'Outstanding mobile app development! The user experience is smooth and our customers love the convenience. Orders have increased by 40%.',
    category: 'Mobile Development',
    completedDate: '2023-11-20'
  },
  {
    id: '4',
    title: 'Learning Management System',
    description: 'A comprehensive LMS platform built with Laravel and React, featuring course management, student tracking, and assessment tools.',
    longDescription: 'A robust Learning Management System designed for educational institutions and corporate training programs. The platform combines Laravel backend with React frontend to deliver a seamless learning experience. Features include course creation and management, student enrollment and progress tracking, interactive assessments, discussion forums, and comprehensive reporting. The system supports multiple user roles including administrators, instructors, and students.',
    features: [
      'Course Creation & Management',
      'Student Enrollment System',
      'Interactive Assessments & Quizzes',
      'Progress Tracking & Analytics',
      'Discussion Forums',
      'Video Streaming Integration',
      'Certificate Generation',
      'Multi-role User Management',
      'Responsive Design',
      'Reporting Dashboard'
    ],
    technologies: ['Laravel', 'React', 'MySQL', 'PHP', 'Bootstrap', 'Chart.js'],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ],
    mainImage: '',
    demoUrl: 'https://demo-lms.com',
    githubUrl: 'https://github.com/username/lms',
    clientRemarks: 'The LMS platform has transformed our training programs. The analytics and reporting features provide valuable insights into student performance.',
    category: 'Web Development',
    completedDate: '2023-10-05'
  },
  {
    id: '5',
    title: 'Real Estate Platform',
    description: 'A modern real estate platform with property listings, virtual tours, and agent management built with MERN stack.',
    longDescription: 'A comprehensive real estate platform that connects buyers, sellers, and agents in a seamless digital environment. The platform features advanced property search with filters, interactive maps, virtual tour integration, and agent profiles. Built with modern technologies to ensure fast performance and excellent user experience. The system includes property management tools for agents, inquiry management, and detailed analytics.',
    features: [
      'Advanced Property Search & Filters',
      'Interactive Maps Integration',
      'Virtual Tour Support',
      'Agent Profile Management',
      'Property Comparison Tool',
      'Inquiry Management System',
      'Mortgage Calculator',
      'Favorites & Saved Searches',
      'Mobile Responsive Design',
      'SEO Optimized Listings'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Google Maps API', 'Cloudinary'],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ],
    mainImage: '',
    demoUrl: 'https://demo-realestate.com',
    githubUrl: 'https://github.com/username/realestate',
    clientRemarks: 'Exceptional platform! The virtual tour integration and map features have significantly improved our property showcase capabilities.',
    category: 'Web Development',
    completedDate: '2023-09-15'
  },
  {
    id: '6',
    title: 'Healthcare Management System',
    description: 'A comprehensive healthcare management system with patient records, appointment scheduling, and telemedicine features.',
    longDescription: 'A complete healthcare management solution designed to streamline medical practice operations. The system manages patient records, appointment scheduling, prescription management, and includes telemedicine capabilities for remote consultations. Built with security and HIPAA compliance in mind, featuring encrypted data storage and secure communication channels. The platform serves healthcare providers, patients, and administrative staff with role-based access control.',
    features: [
      'Patient Record Management',
      'Appointment Scheduling System',
      'Telemedicine Integration',
      'Prescription Management',
      'Medical History Tracking',
      'Insurance Claims Processing',
      'Billing & Payment System',
      'Report Generation',
      'HIPAA Compliant Security',
      'Multi-location Support'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Socket.io', 'JWT'],
    images: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600'
    ],
    mainImage: '',
    demoUrl: 'https://demo-healthcare.com',
    githubUrl: 'https://github.com/username/healthcare',
    clientRemarks: 'The system has revolutionized our practice management. The telemedicine feature was especially valuable during the pandemic.',
    category: 'Web Development',
    completedDate: '2023-08-30'
  }
];

const initialState: ProjectState = {
  projects: hardcodedProjects,
  loading: false,
  error: null,
  selectedProject: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setProjects,
  setSelectedProject,
  setError,
  addProject,
  updateProject,
  deleteProject,
} = projectSlice.actions;

export default projectSlice.reducer;
