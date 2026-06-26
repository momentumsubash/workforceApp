import apiClient from '../api/apiClient';

const authService = {
  // Login user
  login: async (email) => {
    try {
      // Since we don't have a real auth endpoint, we'll fetch employees and match
      const response = await apiClient.get('/employees');
      const employees = response.data;
      
      // Find user by email
      const user = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('User not found with this email');
      }

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Check if user is a supervisor
  isSupervisor: () => {
    const user = authService.getCurrentUser();
    return user && user.is_supervisor === 1;
  },

  // Check if user is an employee
  isEmployee: () => {
    const user = authService.getCurrentUser();
    return user && user.is_supervisor === 0;
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    if (!user) return null;
    return user.is_supervisor === 1 ? 'supervisor' : 'employee';
  },

  // Get supervisor's employees (for supervisors)
  getSupervisorEmployees: async (supervisorId) => {
    try {
      const response = await apiClient.get(`/employees/supervisor/${supervisorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supervisor employees:', error);
      throw error;
    }
  }
};

export default authService;