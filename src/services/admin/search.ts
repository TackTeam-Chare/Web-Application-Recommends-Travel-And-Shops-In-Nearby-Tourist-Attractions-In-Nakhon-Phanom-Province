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

const getToken = (): string | null => localStorage.getItem('token');

export const fetchCategories = async (): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get('/admin/categories', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchDistricts = async (): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get('/admin/districts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
    }
};

export const fetchSeasons = async (): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get('/admin/seasons', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching seasons:', error);
        throw error;
    }
};

export const searchByCategory = async (categoryId: number): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get(`/admin/categories/${categoryId}/place`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(response.data) ? response.data : [];

        return data.map(place => ({
            ...place,
            image_url: place.image_url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}` : null,
        }));
    } catch (error) {
        console.error('Error searching by category:', error);
        throw error;
    }
};

export const searchByDistrict = async (districtId: number): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get(`/admin/districts/${districtId}/place`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(response.data) ? response.data : [];

        return data.map(place => ({
            ...place,
            image_url: place.image_url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}` : null,
        }));
    } catch (error) {
        console.error('Error searching by district:', error);
        throw error;
    }
};

export const searchBySeason = async (seasonId: number): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get(`/admin/seasons/${seasonId}/place`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(response.data) ? response.data : [];

        return data.map(place => ({
            ...place,
            image_url: place.image_url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}` : null,
        }));
    } catch (error) {
        console.error('Error searching by season:', error);
        throw error;
    }
};

export const searchByTime = async (day_of_week: string, opening_time: string, closing_time: string): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get(`/admin/time/${day_of_week}/${opening_time}/${closing_time}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(response.data) ? response.data : [];

        return data.map(place => ({
            ...place,
            image_url: place.image_url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_url}` : null,
        }));
    } catch (error) {
        console.error('Error searching by time:', error);
        throw error;
    }
};

export const searchPlaces = async (query: string): Promise<any[]> => {
    try {
        const token = getToken();
        const response: AxiosResponse<any[]> = await auth.get(`/admin/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(response.data) ? response.data : [];

        return data.map(place => ({
            ...place,
            image_url: typeof place.image_url === 'string'
                ? place.image_url.split(',').map((imagePath: string) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`)
                : []
        }));
    } catch (error) {
        console.error('Error searching places:', error);
        throw error;
    }
};

