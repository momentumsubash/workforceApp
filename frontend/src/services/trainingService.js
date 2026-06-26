import apiClient from '../api/apiClient';

const trainingService = {
  // Get all trainings
  getAll: async () => {
    const response = await apiClient.get('/trainings');
    return response.data;
  },

  // Get training by ID
  getById: async (id) => {
    const response = await apiClient.get(`/trainings/${id}`);
    return response.data;
  },

  // Assign training to employee
  assign: async (assignmentData) => {
    const response = await apiClient.post('/trainings/assign', assignmentData);
    return response.data;
  },

  // Complete training
  complete: async (completionData) => {
    const response = await apiClient.post('/trainings/complete', completionData);
    return response.data;
  },

  // Approve training
  approve: async (approvalData) => {
    const response = await apiClient.post('/trainings/approve', approvalData);
    return response.data;
  },

  // Reject training
  reject: async (rejectData) => {
    const response = await apiClient.post('/trainings/reject', rejectData);
    return response.data;
  },

  // Get training assignments
  getAssignments: async (trainingId) => {
    const response = await apiClient.get(`/trainings/${trainingId}/assignments`);
    return response.data;
  },
};

export default trainingService;