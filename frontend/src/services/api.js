import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://website-generator-tau.vercel.app/api' || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Generate website from prompt
export const generateWebsite = async (prompt) => {
  try {
    const response = await api.post('/generate', { prompt });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to generate website' };
  }
};

// Generate specific content
export const generateContent = async (sectionType, context) => {
  try {
    const response = await api.post('/generate/content', { sectionType, context });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to generate content' };
  }
};

// Improve existing code
export const improveCode = async (code, improvements) => {
  try {
    const response = await api.post('/generate/improve', { code, improvements });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to improve code' };
  }
};

// Get all projects
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch projects' };
  }
};

// Get project by ID
export const getProject = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch project' };
  }
};

// Create new project
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create project' };
  }
};

// Update project
export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update project' };
  }
};

// Delete project
export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete project' };
  }
};

// Get all components
export const getComponents = async () => {
  try {
    const response = await api.get('/components');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch components' };
  }
};

// Get component by type
export const getComponent = async (type) => {
  try {
    const response = await api.get(`/components/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch component' };
  }
};

export default api;
