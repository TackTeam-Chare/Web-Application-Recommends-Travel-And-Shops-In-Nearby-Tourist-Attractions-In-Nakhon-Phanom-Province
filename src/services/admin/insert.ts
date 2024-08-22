import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create Axios instance with base configuration
const auth: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
});

// Add token to headers of every request
auth.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to get token from localStorage
const getToken = (): string | null => localStorage.getItem('token');

// Define types for the input data and responses
interface CreateData {
  [key: string]: any; // Adjust based on your API data structure
}

interface CreateResponse {
  [key: string]: any; // Adjust based on your API response structure
}

// Function to create a tourist entity
export const createTouristEntity = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/place', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating tourist entity:', error);
    throw error;
  }
};

// Function to upload tourism images
export const uploadTourismImages = async (data: FormData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/images', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading tourism images:', error);
    throw error;
  }
};

// Function to create a category
export const createCategory = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/categories', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Function to create a district
export const createDistrict = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/districts', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating district:', error);
    throw error;
  }
};

// Function to create a season
export const createSeason = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/seasons', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating season:', error);
    throw error;
  }
};

// Function to create a seasons relation
export const createSeasonsRelation = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/seasons-relation', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating relation:', error);
    throw error;
  }
};

// Function to create operating hours
export const createOperatingHours = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const token = getToken();
    const response: AxiosResponse<CreateResponse> = await auth.post('/admin/time', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating operating hours:', error);
    throw error;
  }
};

export default auth;
