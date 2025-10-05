const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('jwt_token');
    console.log('API Service initialized with token:', this.token ? 'YES' : 'NO');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('jwt_token', token);
      console.log('Token set in API service:', token.substring(0, 50) + '...');
    } else {
      localStorage.removeItem('jwt_token');
      console.log('Token removed from API service');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers: config.headers,
      hasToken: !!this.token
    });

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', {
        status: response.status,
        data
      });

      if (!response.ok) {
        throw new Error(data.error || data.msg || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Don't set token here - let AuthContext handle it
    console.log('API Service login: Token received:', response.access_token ? 'YES' : 'NO');
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  // Alumni endpoints
  async getMyOpportunities() {
    return this.request('/alumni/opportunities');
  }

  async createOpportunity(opportunityData) {
    return this.request('/alumni/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    });
  }

  async updateOpportunity(opportunityId, opportunityData) {
    return this.request(`/alumni/opportunities/${opportunityId}`, {
      method: 'PUT',
      body: JSON.stringify(opportunityData),
    });
  }

  async deleteOpportunity(opportunityId) {
    return this.request(`/alumni/opportunities/${opportunityId}`, {
      method: 'DELETE',
    });
  }

  async getAlumniApplications() {
    return this.request('/alumni/applications');
  }

  async updateApplicationStatus(applicationId, status) {
    return this.request(`/alumni/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAlumniProfile() {
    return this.request('/alumni/profile');
  }

  async updateAlumniProfile(profileData) {
    return this.request('/alumni/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Student endpoints
  async getOpportunities(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/student/opportunities?${queryParams}` : '/student/opportunities';
    return this.request(endpoint);
  }

  async applyToOpportunity(opportunityId, resumeFile = null) {
    const formData = new FormData();
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/student/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Application failed');
    }

    return data;
  }

  async getMyApplications() {
    return this.request('/student/applications');
  }

  async withdrawApplication(applicationId) {
    return this.request(`/student/applications/${applicationId}`, {
      method: 'DELETE',
    });
  }

  async getStudentProfile() {
    return this.request('/student/profile');
  }

  async updateStudentProfile(profileData) {
    return this.request('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

const apiService = new ApiService();
export default apiService;
