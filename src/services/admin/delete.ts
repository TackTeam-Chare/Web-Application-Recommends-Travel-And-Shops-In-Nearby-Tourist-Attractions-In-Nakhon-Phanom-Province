import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const auth: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    timeout: 5000,
});

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

// Delete Place
export const deletePlace = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/place/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting place with ID ${id}:`, error);
        throw error;
    }
};

// Delete Place Image
export const deletePlaceImage = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/images/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting place image with ID ${id}:`, error);
        throw error;
    }
};

// Delete Seasons Relations
export const deleteSeasonsRelations = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/seasons-relation/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting tourist entity with ID ${id}:`, error);
        throw error;
    }
};

// Delete Operating Hours
export const deleteOperatingHours = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/time/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting operating hours with ID ${id}:`, error);
        throw error;
    }
};

// Delete Seasons
export const deleteSeason = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/seasons/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting season with ID ${id}:`, error);
        throw error;
    }
};

// Delete District by ID
export const deleteDistrict = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/districts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting district with ID ${id}:`, error);
        throw error;
    }
};

// Delete Category by ID
export const deleteCategory = async (id: number): Promise<any> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any> = await auth.delete(`/admin/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error);
        throw error;
    }
};
