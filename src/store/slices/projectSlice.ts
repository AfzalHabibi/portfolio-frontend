import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';
import projectService, { CreateProjectData, CreateProjectWithFilesData, UpdateProjectWithFilesData } from '../../services/projectService';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
  actionLoading: boolean; // For individual project operations
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  selectedProject: null,
  actionLoading: false,
};

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await projectService.getAllProjects();
      return projects;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const project = await projectService.getProjectById(id);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectData, { rejectWithValue }) => {
    try {
      const project = await projectService.createProject(projectData);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProjectWithFiles = createAsyncThunk(
  'projects/createProjectWithFiles',
  async (projectData: CreateProjectWithFilesData, { rejectWithValue }) => {
    try {
      const project = await projectService.createProjectWithFiles(projectData);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectWithFiles = createAsyncThunk(
  'projects/updateProjectWithFiles',
  async ({ id, projectData }: { id: string; projectData: UpdateProjectWithFilesData }, { rejectWithValue }) => {
    try {
      const project = await projectService.updateProjectWithFiles(id, projectData);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectById = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: string; projectData: Partial<CreateProjectData> }, { rejectWithValue }) => {
    try {
      const project = await projectService.updateProject(id, projectData);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProjectById = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create project
      .addCase(createProject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      
      // Create project with files
      .addCase(createProjectWithFiles.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createProjectWithFiles.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProjectWithFiles.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      
      // Update project with files
      .addCase(updateProjectWithFiles.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateProjectWithFiles.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject && state.selectedProject.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProjectWithFiles.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      
      // Update project
      .addCase(updateProjectById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateProjectById.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject && state.selectedProject.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProjectById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete project
      .addCase(deleteProjectById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteProjectById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.selectedProject && state.selectedProject.id === action.payload) {
          state.selectedProject = null;
        }
        state.error = null;
      })
      .addCase(deleteProjectById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedProject,
  clearError,
  clearSelectedProject,
} = projectSlice.actions;

export default projectSlice.reducer;
