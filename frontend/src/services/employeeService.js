import apiClient from '../api/apiClient';

const employeeService = {
  // Get all employees
  getAll: async () => {
    const response = await apiClient.get('/employees');
    return response.data;
  },

  // Get all supervisors
  getSupervisors: async () => {
    const response = await apiClient.get('/employees/supervisors');
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  create: async (employeeData) => {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  update: async (id, employeeData) => {
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },

  // Get employee trainings
  getTrainings: async (employeeId) => {
    const response = await apiClient.get(`/employees/${employeeId}/trainings`);
    return response.data;
  },

  // Get employee certifications
  getCertifications: async (employeeId) => {
    const response = await apiClient.get(`/employees/${employeeId}/certifications`);
    return response.data;
  },
};

export default employeeService;