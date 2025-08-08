import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SiteSettings } from '../../types';
import siteSettingsService from '../../services/siteSettingsService';

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
}

// Fallback hardcoded settings as default
const defaultSettings: SiteSettings = {
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

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchSiteSettings = createAsyncThunk(
  'settings/fetchSiteSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await siteSettingsService.getSiteSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSiteSettings = createAsyncThunk(
  'settings/updateSiteSettings',
  async (settings: SiteSettings, { rejectWithValue }) => {
    try {
      const updatedSettings = await siteSettingsService.updateSiteSettings(settings);
      return updatedSettings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalSettings: (state, action: PayloadAction<Partial<SiteSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch site settings
    builder
      .addCase(fetchSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(fetchSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep default settings if fetch fails
      })
      
      // Update site settings
      .addCase(updateSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  updateLocalSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
