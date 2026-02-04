// API Service for connecting to Express.js backend
// Update BASE_URL to your actual backend URL

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  page?: number;
  limit?: number;
  total?: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth - User
  async registerRequestCode(phone_number: string) {
    return this.request('/user/register/request', {
      method: 'POST',
      body: JSON.stringify({ phone_number }),
    });
  }

  async registerVerifyCode(data: {
    code: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    status: string;
    course_id: number;
    direction_id: number;
  }) {
    const response = await this.request<{ token: string }>('/user/register/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async loginRequestCode(email: string, phone_number: string) {
    return this.request('/user/login/request', {
      method: 'POST',
      body: JSON.stringify({ email, phone_number }),
    });
  }

  async loginVerifyCode(email: string, phone_number: string, code: string) {
    const response = await this.request<{ token: string }>('/user/login/verify', {
      method: 'POST',
      body: JSON.stringify({ email, phone_number, code }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(data: {
    email?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone_number?: string;
  }) {
    return this.request('/user/update', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateDirectionAndCourse(direction_id: number, course_id: number) {
    return this.request('/user/update/settings', {
      method: 'PATCH',
      body: JSON.stringify({ direction_id, course_id }),
    });
  }

  // Auth - Admin
  async adminLogin(username: string, password: string) {
    const response = await this.request<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getAdminProfile() {
    return this.request('/admin/profile');
  }

  // Directions
  async getDirections(page = 1, limit = 20) {
    return this.request(`/directions?page=${page}&limit=${limit}`);
  }

  async getDirection(id: number) {
    return this.request(`/directions/${id}`);
  }

  // Courses
  async getCourses(page = 1, limit = 20, direction_id?: number) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (direction_id) params.append('direction_id', String(direction_id));
    return this.request(`/courses?${params}`);
  }

  async getCourse(id: number) {
    return this.request(`/courses/${id}`);
  }

  // News
  async getNews(page = 1, limit = 20) {
    return this.request(`/news?page=${page}&limit=${limit}`);
  }

  async getNewsItem(id: number) {
    return this.request(`/news/${id}`);
  }

  // Elon (Announcements)
  async getElons(page = 1, limit = 20) {
    return this.request(`/elon?page=${page}&limit=${limit}`);
  }

  async getElon(id: number) {
    return this.request(`/elon/${id}`);
  }

  // Logout
  logout() {
    this.clearToken();
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const api = new ApiService();
