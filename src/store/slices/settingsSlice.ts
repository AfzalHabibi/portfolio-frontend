import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SiteSettings } from '../../types';

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
}

const hardcodedSettings: SiteSettings = {
  name: 'Afzal Habib',
  title: 'Full Stack Developer',
  description: 'Professional MERN Stack Developer with expertise in React, Node.js, PHP, Laravel, and React Native. Passionate about creating innovative web and mobile solutions.',
  email: 'afzalhaabib786@gmail.com',
  phone: '03231103430',
  location: 'Harbanspura Lahore',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe',
    instagram: 'https://instagram.com/johndoe',
    behance: 'https://behance.net/johndoe',
    dribbble: 'https://dribbble.com/johndoe',
  },
  cvUrl: '/assets/john-doe-cv.pdf',
};

const initialState: SettingsState = {
  settings: hardcodedSettings,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSettings: (state, action: PayloadAction<SiteSettings>) => {
      state.settings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateSettings: (state, action: PayloadAction<Partial<SiteSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setSettings,
  setError,
  updateSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
