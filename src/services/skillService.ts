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
}

export default new SkillService();
