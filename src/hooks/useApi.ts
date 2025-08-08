import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  createProjectWithFiles,
  updateProjectById,
  deleteProjectById,
  clearError,
  clearSelectedProject,
} from '../store/slices/projectSlice';
import {
  fetchSiteSettings,
  updateSiteSettings,
  clearError as clearSettingsError,
} from '../store/slices/settingsSlice';
import {
  loginUser,
  registerUser,
  logout,
  clearError as clearAuthError,
  initializeAuth,
} from '../store/slices/authSlice';
import { CreateProjectData, CreateProjectWithFilesData } from '../services/projectService';
import { LoginCredentials, RegisterCredentials } from '../services/authService';
import { SiteSettings } from '../types';

// Projects hook
export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error, selectedProject, actionLoading } = useSelector(
    (state: RootState) => state.projects
  );

  const loadProjects = () => {
    dispatch(fetchProjects());
  };

  const loadProjectById = (id: string) => {
    dispatch(fetchProjectById(id));
  };

  const addProject = (projectData: CreateProjectData) => {
    return dispatch(createProject(projectData));
  };

  const addProjectWithFiles = (projectData: CreateProjectWithFilesData) => {
    return dispatch(createProjectWithFiles(projectData));
  };

  const editProject = (id: string, projectData: Partial<CreateProjectData>) => {
    return dispatch(updateProjectById({ id, projectData }));
  };

  const removeProject = (id: string) => {
    return dispatch(deleteProjectById(id));
  };

  const clearProjectError = () => {
    dispatch(clearError());
  };

  const clearSelectedProjectData = () => {
    dispatch(clearSelectedProject());
  };

  useEffect(() => {
    if (projects.length === 0 && !loading) {
      loadProjects();
    }
  }, []);

  return {
    projects,
    selectedProject,
    loading,
    actionLoading,
    error,
    loadProjects,
    loadProjectById,
    addProject,
    addProjectWithFiles,
    editProject,
    removeProject,
    clearProjectError,
    clearSelectedProjectData,
  };
};

// Settings hook
export const useSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error } = useSelector((state: RootState) => state.settings);

  const loadSettings = () => {
    dispatch(fetchSiteSettings());
  };

  const saveSettings = (settings: SiteSettings) => {
    return dispatch(updateSiteSettings(settings));
  };

  const clearSettingsErrorMessage = () => {
    dispatch(clearSettingsError());
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings,
    clearSettingsErrorMessage,
  };
};

// Auth hook
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials));
  };

  const register = (credentials: RegisterCredentials) => {
    return dispatch(registerUser(credentials));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const clearAuthErrorMessage = () => {
    dispatch(clearAuthError());
  };

  const initAuth = () => {
    dispatch(initializeAuth());
  };

  useEffect(() => {
    initAuth();
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logoutUser,
    clearAuthErrorMessage,
    initAuth,
  };
};
