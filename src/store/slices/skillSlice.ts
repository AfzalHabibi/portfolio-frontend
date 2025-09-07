import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Skill, CreateSkillData, UpdateSkillData, SkillItem } from '../../types';
import skillService, { DirectSkillData } from '../../services/skillService';

interface SkillState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  selectedSkill: Skill | null;
  actionLoading: boolean;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
  selectedSkill: null,
  actionLoading: false,
};

// Async thunks for API calls
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (includeInactive: boolean = false, { rejectWithValue }) => {
    try {
      return await skillService.getAllSkills(includeInactive);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSkillById = createAsyncThunk(
  'skills/fetchSkillById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await skillService.getSkillById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSkill = createAsyncThunk(
  'skills/createSkill',
  async (skillData: CreateSkillData, { rejectWithValue }) => {
    try {
      return await skillService.createSkill(skillData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSkillDirect = createAsyncThunk(
  'skills/createSkillDirect',
  async (skillData: DirectSkillData, { rejectWithValue }) => {
    try {
      return await skillService.createSkillDirect(skillData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async ({ id, skillData }: { id: string; skillData: UpdateSkillData }, { rejectWithValue }) => {
    try {
      return await skillService.updateSkill(id, skillData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (id: string, { rejectWithValue }) => {
    try {
      await skillService.deleteSkill(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSkillItem = createAsyncThunk(
  'skills/addSkillItem',
  async ({ categoryId, itemData }: { categoryId: string; itemData: Omit<SkillItem, '_id'> }, { rejectWithValue }) => {
    try {
      return await skillService.addSkillItem(categoryId, itemData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSkillItem = createAsyncThunk(
  'skills/updateSkillItem',
  async ({ 
    categoryId, 
    itemId, 
    itemData 
  }: { 
    categoryId: string; 
    itemId: string; 
    itemData: Partial<SkillItem> 
  }, { rejectWithValue }) => {
    try {
      return await skillService.updateSkillItem(categoryId, itemId, itemData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSkillItem = createAsyncThunk(
  'skills/deleteSkillItem',
  async ({ categoryId, itemId }: { categoryId: string; itemId: string }, { rejectWithValue }) => {
    try {
      return await skillService.deleteSkillItem(categoryId, itemId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const reorderSkills = createAsyncThunk(
  'skills/reorderSkills',
  async (skillOrders: Array<{ id: string; displayOrder: number }>, { rejectWithValue }) => {
    try {
      return await skillService.reorderSkills(skillOrders);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSkillActive = createAsyncThunk(
  'skills/toggleSkillActive',
  async ({ categoryId, itemId }: { categoryId: string; itemId: string }, { rejectWithValue }) => {
    try {
      return await skillService.toggleSkillActive(categoryId, itemId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSkillFeatured = createAsyncThunk(
  'skills/toggleSkillFeatured',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      return await skillService.toggleSkillFeatured(categoryId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSelectedSkill: (state, action: PayloadAction<Skill | null>) => {
      state.selectedSkill = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSkill: (state) => {
      state.selectedSkill = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch skills
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch skill by ID
    builder
      .addCase(fetchSkillById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedSkill = action.payload;
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Create skill
    builder
      .addCase(createSkill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.skills.push(action.payload);
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Create skill direct
    builder
      .addCase(createSkillDirect.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createSkillDirect.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Check if category already exists, update it; otherwise add new skill
        const existingSkillIndex = state.skills.findIndex(skill => skill.category === action.payload.category);
        if (existingSkillIndex !== -1) {
          // Update existing skill category
          state.skills[existingSkillIndex] = action.payload;
        } else {
          // Add new skill category
          state.skills.push(action.payload);
        }
      })
      .addCase(createSkillDirect.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update skill
    builder
      .addCase(updateSkill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id || skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        if (state.selectedSkill && (state.selectedSkill.id === action.payload.id || state.selectedSkill._id === action.payload._id)) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Delete skill
    builder
      .addCase(deleteSkill.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.skills = state.skills.filter(skill => skill.id !== action.payload && skill._id !== action.payload);
        if (state.selectedSkill && (state.selectedSkill.id === action.payload || state.selectedSkill._id === action.payload)) {
          state.selectedSkill = null;
        }
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Add skill item
    builder
      .addCase(addSkillItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addSkillItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id || skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        if (state.selectedSkill && (state.selectedSkill.id === action.payload.id || state.selectedSkill._id === action.payload._id)) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(addSkillItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update skill item
    builder
      .addCase(updateSkillItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateSkillItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id || skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        if (state.selectedSkill && (state.selectedSkill.id === action.payload.id || state.selectedSkill._id === action.payload._id)) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(updateSkillItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Delete skill item
    builder
      .addCase(deleteSkillItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteSkillItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id || skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        if (state.selectedSkill && (state.selectedSkill.id === action.payload.id || state.selectedSkill._id === action.payload._id)) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(deleteSkillItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Reorder skills
    builder
      .addCase(reorderSkills.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(reorderSkills.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.skills = action.payload;
      })
      .addCase(reorderSkills.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Toggle skill active
    builder
      .addCase(toggleSkillActive.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleSkillActive.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id || skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        if (state.selectedSkill && (state.selectedSkill.id === action.payload.id || state.selectedSkill._id === action.payload._id)) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(toggleSkillActive.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Toggle skill featured
    builder
      .addCase(toggleSkillFeatured.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleSkillFeatured.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id || skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        if (state.selectedSkill && (state.selectedSkill.id === action.payload.id || state.selectedSkill._id === action.payload._id)) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(toggleSkillFeatured.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSkill, clearError, clearSelectedSkill } = skillSlice.actions;

export default skillSlice.reducer;
