// API Service for connecting to Express.js backend
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
    console.log('API Service initialized with token:', this.token ? this.token.substring(0, 20) + '...' : 'null'); // Debug log
  }

  setToken(token: string) {
    console.log('Setting token:', token.substring(0, 20) + '...'); // Debug log
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    console.log('Clearing token'); // Debug log
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {};

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    // Add any custom headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // Add authorization token
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
      console.log('Making request to', endpoint, 'with token'); // Debug log
    } else {
      console.log('Making request to', endpoint, 'without token'); // Debug log
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Response from', endpoint, ':', data); // Debug log
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

  async verifyCodeOnly(phone_number: string, code: string) {
    return this.request('/user/register/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone_number, code }),
    });
  }

  async registerVerifyCode(data: {
    code: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone_number: string;
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

  async registerForCourse(data: {
    course_id: number;
    direction_id: number;
    address?: string;
    workplace?: string;
    position?: string;
  }) {
    return this.request('/user/register/course', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loginRequestCode(data: { email: string; phone_number: string }) {
    return this.request('/user/login/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loginVerifyCode(data: { email: string; phone_number: string; code: string }) {
    const response = await this.request<{ token: string }>('/user/login/verify', {
      method: 'POST',
      body: JSON.stringify(data),
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

  async createAdmin(username: string, password: string) {
    return this.request('/admin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async updateAdminProfile(username: string, password: string) {
    return this.request('/admin/update', {
      method: 'PATCH',
      body: JSON.stringify({ username, password }),
    });
  }

  // Admin - User Management
  async getAllUsers() {
    return this.request('/user');
  }

  async createUser(data: {
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    status: string;
    course_id: number;
    direction_id: number;
  }) {
    return this.request('/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin - News Management
  async createNews(data: {
    title_en: string;
    title_ru: string;
    title_uz: string;
    content_en: string;
    content_ru: string;
    content_uz: string;
  }, files?: File[]) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (files) {
      files.forEach(file => formData.append('medias', file));
    }

    return this.request('/news', {
      method: 'POST',
      body: formData,
      // Don't set headers - let browser set Content-Type with boundary
    });
  }

  async updateNews(id: number, data: {
    title_en?: string;
    title_ru?: string;
    title_uz?: string;
    content_en?: string;
    content_ru?: string;
    content_uz?: string;
  }, files?: File[]) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (files) {
      files.forEach(file => formData.append('medias', file));
    }

    return this.request(`/news/${id}`, {
      method: 'PATCH',
      body: formData,
      // Don't set headers - let browser set Content-Type with boundary
    });
  }

  async deleteNews(id: number) {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Direction Management
  async createDirection(data: {
    title_en: string;
    title_ru: string;
    title_uz: string;
    description_en: string;
    description_ru: string;
    description_uz: string;
    published_at: string;
    ends_at: string;
  }) {
    return this.request('/direction', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDirection(id: number, data: {
    title_en?: string;
    title_ru?: string;
    title_uz?: string;
    description_en?: string;
    description_ru?: string;
    description_uz?: string;
    published_at?: string;
    ends_at?: string;
  }) {
    return this.request(`/direction/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDirection(id: number) {
    return this.request(`/direction/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Course Management
  async createCourse(data: {
    title_en: string;
    title_ru: string;
    title_uz: string;
    description_en: string;
    description_ru: string;
    description_uz: string;
    published_at: string;
    start_date: string;
    ends_at: string;
    direction_id: number;
  }) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: number, data: {
    title_en?: string;
    title_ru?: string;
    title_uz?: string;
    description_en?: string;
    description_ru?: string;
    description_uz?: string;
    published_at?: string;
    start_date?: string;
    ends_at?: string;
    direction_id?: number;
  }) {
    return this.request(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: number) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Opportunity Management
  async createOpportunity(data: {
    title_en: string;
    title_ru: string;
    title_uz: string;
    content_en: string;
    content_ru: string;
    content_uz: string;
    ends_at: string;
  }, files?: File[]) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (files) {
      files.forEach(file => formData.append('medias', file));
    }

    return this.request('/elon', {
      method: 'POST',
      body: formData,
      // Don't set headers - let browser set Content-Type with boundary
    });
  }

  async updateOpportunity(id: number, data: {
    title_en?: string;
    title_ru?: string;
    title_uz?: string;
    content_en?: string;
    content_ru?: string;
    content_uz?: string;
    ends_at?: string;
  }, files?: File[]) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (files) {
      files.forEach(file => formData.append('medias', file));
    }

    return this.request(`/elon/${id}`, {
      method: 'PATCH',
      body: formData,
      // Don't set headers - let browser set Content-Type with boundary
    });
  }

  async deleteOpportunity(id: number) {
    return this.request(`/elon/${id}`, {
      method: 'DELETE',
    });
  }

  // Directions
  async getDirections(page = 1, limit = 20) {
    return this.request(`/direction?page=${page}&limit=${limit}`);
  }

  async getDirection(id: number) {
    return this.request(`/direction/${id}`);
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

  // Gallery
  async getGallery(page = 1, limit = 50) {
    return this.request(`/gallery?page=${page}&limit=${limit}`);
  }

  async getGalleryItem(id: number) {
    return this.request(`/gallery/${id}`);
  }

  async createGalleryItem(title: string, file: File) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('media', file);

    return this.request('/gallery', {
      method: 'POST',
      body: formData,
    });
  }

  async updateGalleryItem(id: number, title: string, file?: File | null) {
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
      formData.append('media', file);
    }

    return this.request(`/gallery/${id}`, {
      method: 'PATCH',
      body: formData,
    });
  }

  async deleteGalleryItem(id: number) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    });
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
