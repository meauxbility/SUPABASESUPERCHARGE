/**
 * ApiManager - Independent API Integration Layer
 * Designed to work with Shopify initially, then migrate to independent platform
 */

class ApiManager {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || process.env.API_BASE_URL || '';
    this.apiKey = config.apiKey || process.env.API_KEY || '';
    this.shopifyStore = config.shopifyStore || process.env.SHOPIFY_STORE_URL || '';
    this.shopifyToken = config.shopifyToken || process.env.SHOPIFY_ACCESS_TOKEN || '';
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.timeout = config.timeout || 10000;
    
    this.init();
  }

  /**
   * Initialize API manager
   */
  init() {
    this.setupInterceptors();
    console.log('ApiManager initialized');
  }

  /**
   * Setup request/response interceptors
   */
  setupInterceptors() {
    // Add authentication headers
    this.addAuthHeaders = (config) => {
      if (this.apiKey) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey
        };
      }
      return config;
    };

    // Handle errors
    this.handleError = (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    };
  }

  /**
   * Make API request with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   */
  async makeRequest(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const config = this.buildRequestConfig(options);
    
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.executeRequest(url, config);
        return this.handleResponse(response);
      } catch (error) {
        lastError = error;
        
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
          console.log(`Retry attempt ${attempt + 1} for ${endpoint}`);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Execute HTTP request
   * @param {string} url - Request URL
   * @param {Object} config - Request configuration
   */
  async executeRequest(url, config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Build complete URL
   * @param {string} endpoint - API endpoint
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    if (endpoint.startsWith('/')) {
      return `${this.baseUrl}${endpoint}`;
    }
    
    return `${this.baseUrl}/${endpoint}`;
  }

  /**
   * Build request configuration
   * @param {Object} options - Request options
   */
  buildRequestConfig(options) {
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add authentication
    config = this.addAuthHeaders(config);
    
    return config;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   */
  async get(endpoint, params = {}) {
    const queryString = this.buildQueryString(params);
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return await this.makeRequest(url, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   */
  async post(endpoint, data = {}) {
    return await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   */
  async put(endpoint, data = {}) {
    return await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   */
  async delete(endpoint) {
    return await this.makeRequest(endpoint, { method: 'DELETE' });
  }

  /**
   * Build query string from parameters
   * @param {Object} params - Parameters object
   */
  buildQueryString(params) {
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  /**
   * Delay execution
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Shopify-specific methods
   */

  /**
   * Sync data with Shopify
   * @param {Object} data - Data to sync
   */
  async syncWithShopify(data) {
    if (!this.shopifyStore || !this.shopifyToken) {
      console.warn('Shopify credentials not configured');
      return null;
    }

    try {
      const response = await fetch(`${this.shopifyStore}/admin/api/2023-10/products.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.shopifyToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product: data })
      });

      return await response.json();
    } catch (error) {
      console.error('Shopify sync error:', error);
      throw error;
    }
  }

  /**
   * Get Shopify products
   */
  async getShopifyProducts(params = {}) {
    if (!this.shopifyStore || !this.shopifyToken) {
      throw new Error('Shopify credentials not configured');
    }

    const queryString = this.buildQueryString(params);
    const url = `${this.shopifyStore}/admin/api/2023-10/products.json${queryString ? `?${queryString}` : ''}`;
    
    return await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': this.shopifyToken
      }
    }).then(response => response.json());
  }

  /**
   * Independent platform methods
   */

  /**
   * Submit form data to independent API
   * @param {string} formType - Type of form
   * @param {Object} formData - Form data
   */
  async submitForm(formType, formData) {
    return await this.post(`/forms/${formType}`, formData);
  }

  /**
   * Get user data
   * @param {string} userId - User ID
   */
  async getUserData(userId) {
    return await this.get(`/users/${userId}`);
  }

  /**
   * Update user data
   * @param {string} userId - User ID
   * @param {Object} userData - User data
   */
  async updateUserData(userId, userData) {
    return await this.put(`/users/${userId}`, userData);
  }

  /**
   * Get analytics data
   * @param {Object} params - Analytics parameters
   */
  async getAnalytics(params = {}) {
    return await this.get('/analytics', params);
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return { status: 'healthy', data: response };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Configuration methods
   */

  /**
   * Update API configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    Object.assign(this, config);
    console.log('API configuration updated');
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      apiKey: this.apiKey ? '***' : null,
      shopifyStore: this.shopifyStore,
      shopifyToken: this.shopifyToken ? '***' : null,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      timeout: this.timeout
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiManager;
}

// Global access for browser
if (typeof window !== 'undefined') {
  window.ApiManager = ApiManager;
}
