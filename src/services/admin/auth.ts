import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthResponse, Admin, Profile, UpdateData, UpdateResponse } from '@/models/interfaces';

// Create Axios instance for authentication-related API calls
const auth: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  timeout: 5000,
});

// Add request interceptor to include authorization token
auth.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to get token from localStorage
const getToken = (): string | null => localStorage.getItem('token');

// API function to log in
export const login = async (data: Record<string, any>): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await auth.post('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// API function to verify password
export const verifyPassword = async (data: Record<string, any>): Promise<any> => {
  try {
    const token = getToken();
    const response: AxiosResponse<any> = await auth.post('/auth/verify-password', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};

// API function to get all admins
export const getAllAdmins = async (): Promise<Admin[]> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Admin[]> = await auth.get('/auth/admin', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

// API function to get admin by ID
export const getAdminById = async (id: number): Promise<Admin> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Admin> = await auth.get(`/auth/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin:', error);
    throw error;
  }
};

// API function to get profile
export const getProfile = async (): Promise<Profile> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Profile> = await auth.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// API function to update profile
export const updateProfile = async (data: Record<string, any>): Promise<Profile> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Profile> = await auth.put('/auth/profile', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// API function to add admin
export const addAdmin = async (data: Record<string, any>): Promise<Admin> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Admin> = await auth.post('/auth/register', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};

// API function to update admin by ID
export const updateAdmin = async (id: number, data: Record<string, any>): Promise<Admin> => {
  try {
    const token = getToken();
    const response: AxiosResponse<Admin> = await auth.put(`/auth/admin/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

// API function to delete admin by ID
export const deleteAdmin = async (id: number): Promise<any> => {
  try {
    const token = getToken();
    const response: AxiosResponse<any> = await auth.delete(`/auth/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

// API function to register a new user
export const register = async (data: Record<string, any>): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await auth.post('/auth/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// API function to log out
export const logout = async (): Promise<any> => {
  try {
    const token = getToken();
    const response: AxiosResponse<any> = await auth.post('/auth/logout', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
