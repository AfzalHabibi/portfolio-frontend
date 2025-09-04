import api from './api';
import { Project } from '../types';

export interface CreateProjectData {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  mainImage: string;
  images?: string[];
  videos?: string[];
  demoUrl?: string;
  githubUrl?: string;
  clientRemarks?: string;
  category: string;
  completedDate: string;
}

export interface CreateProjectWithFilesData extends Omit<CreateProjectData, 'mainImage' | 'images' | 'videos'> {
  mainImage: File;
  images?: File[];
  videos?: File[];
}

export interface UpdateProjectWithFilesData extends Omit<CreateProjectData, 'mainImage' | 'images' | 'videos'> {
  mainImage?: File;
  images?: File[];
  videos?: File[];
  existingImages?: string[];
  existingVideos?: string[];
}

class ProjectService {
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects');
      return response.data.map((project: any) => ({
        ...project,
        id: project._id, // Convert MongoDB _id to id
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  }

  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await api.get(`/projects/${id}`);
      return {
        ...response.data,
        id: response.data._id, // Convert MongoDB _id to id
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  }

  async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const response = await api.post('/projects', projectData);
      return {
        ...response.data.project,
        id: response.data.project._id, // Convert MongoDB _id to id
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  }

  async createProjectWithFiles(projectData: CreateProjectWithFilesData): Promise<Project> {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('longDescription', projectData.longDescription);
      formData.append('features', JSON.stringify(projectData.features));
      formData.append('technologies', JSON.stringify(projectData.technologies));
      formData.append('category', projectData.category);
      formData.append('completedDate', projectData.completedDate);
      
      if (projectData.demoUrl) formData.append('demoUrl', projectData.demoUrl);
      if (projectData.githubUrl) formData.append('githubUrl', projectData.githubUrl);
      if (projectData.clientRemarks) formData.append('clientRemarks', projectData.clientRemarks);
      
      // Add main image
      formData.append('mainImage', projectData.mainImage);
      
      // Add additional images
      if (projectData.images) {
        projectData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      // Add videos
      if (projectData.videos) {
        projectData.videos.forEach((video) => {
          formData.append('videos', video);
        });
      }

      const response = await api.post('/projects/with-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data.project,
        id: response.data.project._id, // Convert MongoDB _id to id
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create project with files');
    }
  }

  async updateProject(id: string, projectData: Partial<CreateProjectData>): Promise<Project> {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return {
        ...response.data.project,
        id: response.data.project._id, // Convert MongoDB _id to id
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  }

  async updateProjectWithFiles(id: string, projectData: UpdateProjectWithFilesData): Promise<Project> {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('longDescription', projectData.longDescription);
      formData.append('features', JSON.stringify(projectData.features));
      formData.append('technologies', JSON.stringify(projectData.technologies));
      formData.append('category', projectData.category);
      formData.append('completedDate', projectData.completedDate);
      
      if (projectData.demoUrl) formData.append('demoUrl', projectData.demoUrl);
      if (projectData.githubUrl) formData.append('githubUrl', projectData.githubUrl);
      if (projectData.clientRemarks) formData.append('clientRemarks', projectData.clientRemarks);
      
      // Add main image if provided
      if (projectData.mainImage) {
        formData.append('mainImage', projectData.mainImage);
      }
      
      // Add additional images
      if (projectData.images) {
        projectData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      // Add videos
      if (projectData.videos) {
        projectData.videos.forEach((video) => {
          formData.append('videos', video);
        });
      }
      
      // Add existing images to keep
      if (projectData.existingImages) {
        formData.append('existingImages', JSON.stringify(projectData.existingImages));
      }
      
      // Add existing videos to keep
      if (projectData.existingVideos) {
        formData.append('existingVideos', JSON.stringify(projectData.existingVideos));
      }

      const response = await api.put(`/projects/${id}/with-files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data.project,
        id: response.data.project._id, // Convert MongoDB _id to id
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update project with files');
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }
}

export default new ProjectService();
