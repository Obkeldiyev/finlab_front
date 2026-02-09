// Data service for connecting to backend API
import { api } from './api';

export interface Direction {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  courses?: Course[];
  published_at: string;
  ends_at: string;
}

export interface Course {
  id: number;
  direction_id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  published_at: string;
  start_date: string;
  ends_at: string;
  hours?: number;
  direction?: Direction;
}

export interface NewsItem {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  published_at: string;
  medias: Array<{
    id: number;
    url: string;
    type: string;
  }>;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email?: string;
  phone_number: string;
  status: string;
  course_id?: number;
  direction_id?: number;
  address?: string;
  workplace?: string;
  position?: string;
  created_at: string;
  role: string;
  course?: Course;
  direction?: Direction;
}

export interface Opportunity {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  published_at: string;
  ends_at: string;
  medias: Array<{
    id: number;
    url: string;
    type: string;
  }>;
}

class DataService {
  // Directions
  async getDirections(): Promise<Direction[]> {
    try {
      const response = await api.getDirections();
      const data = response.data || [];
      return Array.isArray(data) ? data.filter(d => d != null) : [];
    } catch (error) {
      console.error('Failed to fetch directions:', error);
      return [];
    }
  }

  async getDirection(id: number): Promise<Direction | null> {
    try {
      const response = await api.getDirection(id);
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch direction:', error);
      return null;
    }
  }

  // Courses
  async getCourses(directionId?: number): Promise<Course[]> {
    try {
      const response = await api.getCourses(1, 100, directionId);
      const data = response.data || [];
      return Array.isArray(data) ? data.filter(c => c != null) : [];
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return [];
    }
  }

  async getCourse(id: number): Promise<Course | null> {
    try {
      const response = await api.getCourse(id);
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch course:', error);
      return null;
    }
  }

  // News
  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await api.getNews();
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  async getNewsItem(id: number): Promise<NewsItem | null> {
    try {
      const response = await api.getNewsItem(id);
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch news item:', error);
      return null;
    }
  }

  // User
  async getUserProfile(): Promise<User | null> {
    try {
      const response = await api.getUserProfile();
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  // Opportunities (using elon endpoint)
  async getOpportunities(): Promise<Opportunity[]> {
    try {
      const response = await api.getElons();
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      return [];
    }
  }

  async getOpportunity(id: number): Promise<Opportunity | null> {
    try {
      const response = await api.getElon(id);
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch opportunity:', error);
      return null;
    }
  }
}

export const dataService = new DataService();