// API Configuration
// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// Assets API
export const assetsAPI = {
  getAll: () => apiRequest('/assets'),
  getById: (id) => apiRequest(`/assets/${id}`),
  create: (data) => apiRequest('/assets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/assets/${id}`, { method: 'DELETE' }),
};

// Warehouse API
export const warehouseAPI = {
  getInfo: () => apiRequest('/warehouse'),
  getZones: () => apiRequest('/warehouse/zones'),
  getInventory: () => apiRequest('/warehouse/inventory'),
  getExpiryAlerts: () => apiRequest('/warehouse/expiry-alerts'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => apiRequest('/analytics/dashboard'),
  getCarbon: (timeRange = 'daily') => apiRequest(`/analytics/carbon?timeRange=${timeRange}`),
  getProfit: () => apiRequest('/analytics/profit'),
  getProductivity: () => apiRequest('/analytics/productivity'),
};

// Hospital API
export const hospitalAPI = {
  getInventory: () => apiRequest('/hospital/inventory'),
  getDepartments: () => apiRequest('/hospital/departments'),
  getRequests: () => apiRequest('/hospital/requests'),
  createRequest: (data) => apiRequest('/hospital/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateRequestStatus: (id, status) => apiRequest(`/hospital/requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (data) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => {
    const token = localStorage.getItem('token');
    return apiRequest('/auth/me', { 
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateProfile: (data) => {
    const token = localStorage.getItem('token');
    return apiRequest('/auth/profile', { 
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
  },
};

// Health check
export const healthCheck = () => apiRequest('/health');

export default {
  assets: assetsAPI,
  warehouse: warehouseAPI,
  analytics: analyticsAPI,
  hospital: hospitalAPI,
  auth: authAPI,
  healthCheck,
};
