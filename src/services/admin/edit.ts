import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { UpdateResponse, UpdateData} from '@/models/interface';

const auth: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    timeout: 5000,
});

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


// Function to update a tourist entity
export const updateTouristEntity = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`admin/place/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tourist entity:', error);
        throw error;
    }
};

// Function to update tourism images
export const updateTourismImages = async (id: number, data: FormData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/images/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tourism images:', error);
        throw error;
    }
};

// Function to update a category
export const updateCategory = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/categories/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Function to update a district
export const updateDistrict = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/districts/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating district:', error);
        throw error;
    }
};

// Function to update a season
export const updateSeason = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/seasons/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating season:', error);
        throw error;
    }
};

// Function to update operating hours
export const updateOperatingHours = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/time/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating operating hour:', error);
        throw error;
    }
};

// Function to update seasons relation
export const updateSeasonsRelation = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/seasons-relation/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating seasons relation:', error);
        throw error;
    }
};

// Function to update tourism entities images
export const updateTourismEntitiesImages = async (id: number, data: UpdateData): Promise<UpdateResponse> => {
    try {
        const token = getToken();
        const response: AxiosResponse<UpdateResponse> = await auth.put(`/admin/place/images/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tourism entities images:', error);
        throw error;
    }
};
