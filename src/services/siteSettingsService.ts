import api from './api';
import { SiteSettings } from '../types';

class SiteSettingsService {
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const response = await api.get('/site-settings');
      return response.data;
    } catch (error: any) {
      // If no settings found in backend, return default hardcoded settings
      if (error.response?.status === 404) {
        return {
          name: 'Afzal Habib',
          title: 'Full Stack Developer',
          description: 'Professional MERN Stack Developer with expertise in React, Node.js, PHP, Laravel, and React Native. Passionate about creating innovative web and mobile solutions.',
          email: 'afzalhaabib786@gmail.com',
          phone: '03231103430',
          location: 'Harbanspura Lahore',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/afzal-habib-5298a0272/',
            github: 'https://github.com/AfzalHabibi', 
            twitter: 'https://x.com/AfzalHabib34',
            instagram: 'https://www.instagram.com/afzalhabib786/',
            behance: 'https://www.behance.net/afzalhabib',
            dribbble: 'https://dribbble.com/Afzalhabib786',
          },
          cvUrl: './afzal_habib_resume.pdf',
        };
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch site settings');
    }
  }

  async updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
    try {
      const response = await api.put('/site-settings', settings);
      return response.data.settings;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update site settings');
    }
  }
}

export default new SiteSettingsService();
