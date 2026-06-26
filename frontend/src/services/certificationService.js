import apiClient from '../api/apiClient';

const certificationService = {
  // Get all certifications
  getAll: async () => {
    const response = await apiClient.get('/certifications');
    return response.data;
  },

  // Get certification by ID
  getById: async (id) => {
    const response = await apiClient.get(`/certifications/${id}`);
    return response.data;
  },

  // Create certification
  create: async (certData) => {
    const response = await apiClient.post('/certifications', certData);
    return response.data;
  },

  // Update certification
  update: async (id, certData) => {
    const response = await apiClient.put(`/certifications/${id}`, certData);
    return response.data;
  },

  // Delete certification
  delete: async (id) => {
    const response = await apiClient.delete(`/certifications/${id}`);
    return response.data;
  },

  // Get expiring certifications
  getExpiring: async () => {
    const response = await apiClient.get('/certifications/expiring');
    return response.data;
  },

  // Get employee certifications
  getByEmployee: async (employeeId) => {
    const response = await apiClient.get(`/certifications/employee/${employeeId}`);
    return response.data;
  },
};

export default certificationService;