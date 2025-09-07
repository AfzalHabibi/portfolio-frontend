import api from './api';
import { Skill, CreateSkillData, UpdateSkillData, SkillItem } from '../types';

export interface DirectSkillData {
  name: string;
  category: string;
  keywords?: string[];
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  experience: string;
  description: string;
  projects?: string[];
  certifications?: string[];
  tools_used?: string[];
  best_practices?: string[];
  achievements?: string[];
  version?: string;
  methodologies?: string[];
  performance_metrics?: string[];
  used_in_roles?: string[];
  difficulty_handled?: string;
  endorsements?: string[];
  icon?: string;
  color?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

class SkillService {
  async getAllSkills(includeInactive = false): Promise<Skill[]> {
    try {
      const response = await api.get(`/skills?includeInactive=${includeInactive}`);
      return response.data.map((skill: any) => ({
        ...skill,
        id: skill._id,
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch skills');
    }
  }

  async getSkillById(id: string): Promise<Skill> {
    try {
      const response = await api.get(`/skills/${id}`);
      return {
        ...response.data,
        id: response.data._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch skill');
    }
  }

  async createSkillDirect(skillData: DirectSkillData): Promise<Skill> {
    try {
      const response = await api.post('/skills/direct', skillData);
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create skill');
    }
  }

  async createSkill(skillData: CreateSkillData): Promise<Skill> {
    try {
      const response = await api.post('/skills', skillData);
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create skill');
    }
  }

  async updateSkill(id: string, skillData: UpdateSkillData): Promise<Skill> {
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update skill');
    }
  }

  async deleteSkill(id: string): Promise<void> {
    try {
      await api.delete(`/skills/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete skill');
    }
  }

  async addSkillItem(categoryId: string, itemData: Omit<SkillItem, '_id'>): Promise<Skill> {
    try {
      const response = await api.post(`/skills/${categoryId}/items`, itemData);
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add skill item');
    }
  }

  async updateSkillItem(categoryId: string, itemId: string, itemData: Partial<SkillItem>): Promise<Skill> {
    try {
      const response = await api.put(`/skills/${categoryId}/items/${itemId}`, itemData);
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update skill item');
    }
  }

  async deleteSkillItem(categoryId: string, itemId: string): Promise<Skill> {
    try {
      const response = await api.delete(`/skills/${categoryId}/items/${itemId}`);
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete skill item');
    }
  }

  async reorderSkills(skillOrders: Array<{ id: string; displayOrder: number }>): Promise<Skill[]> {
    try {
      const response = await api.put('/skills/reorder', { skillOrders });
      return response.data.skills.map((skill: any) => ({
        ...skill,
        id: skill._id,
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reorder skills');
    }
  }

  async toggleSkillActive(categoryId: string, itemId: string): Promise<Skill> {
    try {
      // First get current state
      const currentSkill = await this.getSkillById(categoryId);
      const currentItem = currentSkill.items.find(item => item._id === itemId);
      const newActiveState = !(currentItem?.isActive !== false);
      
      const response = await api.put(`/skills/${categoryId}/items/${itemId}`, { 
        isActive: newActiveState
      });
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle skill active status');
    }
  }

  async toggleSkillFeatured(categoryId: string): Promise<Skill> {
    try {
      // First get current state
      const currentSkill = await this.getSkillById(categoryId);
      const newFeaturedState = !currentSkill.isFeatured;
      
      const response = await api.put(`/skills/${categoryId}`, { 
        isFeatured: newFeaturedState
      });
      return {
        ...response.data.skill,
        id: response.data.skill._id,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle skill featured status');
    }
  }
}

export default new SkillService();
