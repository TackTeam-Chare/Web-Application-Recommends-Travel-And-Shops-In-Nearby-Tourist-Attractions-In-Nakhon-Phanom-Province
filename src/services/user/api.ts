import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Place,EntityResponse,Season,District,Category} from '@/models/interface';


const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
});

// Function to fetch top-rated tourist entities
export const getTopRatedTouristAttractions = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places/top-rated/tourist-attractions');
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map((image: { image_path: string }) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }));
  } catch (error: any) {
    console.error('Error fetching top-rated tourist entities:', error);
    throw new Error(error.response?.data?.error || 'Error fetching top-rated tourist entities');
  }
};

// Fetch top-rated tourist attractions
export const fetchTopRatedTouristAttractions = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places/top-rated/tourist-attractions');
    const data = Array.isArray(response.data) ? response.data : [];

    // Map images for each place to construct full URLs
    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error: any) {
    console.error('Error fetching top-rated tourist attractions:', error);
    throw new Error(error.response?.data?.error || 'Error fetching top-rated tourist attractions');
  }
};

// Fetch top-rated accommodations
export const fetchTopRatedAccommodations = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places/top-rated/accommodations');
    const data = Array.isArray(response.data) ? response.data : [];

    // Map images for each accommodation
    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error: any) {
    console.error('Error fetching top-rated accommodations:', error);
    throw new Error(error.response?.data?.error || 'Error fetching top-rated accommodations');
  }
};

// Fetch top-rated restaurants
export const fetchTopRatedRestaurants = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places/top-rated/restaurants');
    const data = Array.isArray(response.data) ? response.data : [];

    // Map images for each restaurant
    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error: any) {
    console.error('Error fetching top-rated restaurants:', error);
    throw new Error(error.response?.data?.error || 'Error fetching top-rated restaurants');
  }
};

// Fetch top-rated souvenir shops
export const fetchTopRatedSouvenirShops = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places/top-rated/souvenir-shops');
    const data = Array.isArray(response.data) ? response.data : [];

    // Map images for each souvenir shop
    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error: any) {
    console.error('Error fetching top-rated souvenir shops:', error);
    throw new Error(error.response?.data?.error || 'Error fetching top-rated souvenir shops');
  }
};


// Function to fetch categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response: AxiosResponse<Category[]> = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Function to fetch districts
export const fetchDistricts = async (): Promise<District[]> => {
  try {
    const response: AxiosResponse<District[]> = await api.get('/districts');
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

// Function to fetch seasons
export const fetchSeasons = async (): Promise<Season[]> => {
  try {
    const response: AxiosResponse<Season[]> = await api.get('/seasons');
    return response.data;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    throw error;
  }
};

// Function to search accommodations
export const searchAccommodations = async (query: string): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/search/accommodations?q=${query}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: typeof place.image_url === 'string'
        ? place.image_url.split(',').map(imagePath => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`)
        : []
    }));
  } catch (error) {
    console.error('Error searching accommodations:', error);
    throw error;
  }
};

// Function to search restaurants
export const searchRestaurants = async (query: string): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/search/restaurants?q=${query}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: typeof place.image_url === 'string'
        ? place.image_url.split(',').map(imagePath => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`)
        : []
    }));
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};

// Function to search souvenir shops
export const searchSouvenirShops = async (query: string): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/search/souvenir-shops?q=${query}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: typeof place.image_url === 'string'
        ? place.image_url.split(',').map(imagePath => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`)
        : []
    }));
  } catch (error) {
    console.error('Error searching souvenir shops:', error);
    throw error;
  }
};

// Function to search tourist attractions
export const searchTouristAttractions = async (query: string): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/search/tourist-attractions?q=${query}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: typeof place.image_url === 'string'
        ? place.image_url.split(',').map(imagePath => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`)
        : []
    }));
  } catch (error) {
    console.error('Error searching tourist attractions:', error);
    throw error;
  }
};

// Function to search places by category
export const searchByCategory = async (categoryId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/categories/${categoryId}/place`);
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

// Function to search places by district
export const searchByDistrict = async (districtId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/districts/${districtId}/place`);
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

// Function to search places by season
export const searchBySeason = async (seasonId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/seasons/${seasonId}/place`);
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

// Function to search places by time
export const searchByTime = async (day_of_week: string, opening_time: string, closing_time: string): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/time/${day_of_week}/${opening_time}/${closing_time}`);
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

// Function to fetch real-time tourist attractions
export const fetchRealTimeTouristAttractions = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/seasons/real-time');
    const data = Array.isArray(response.data) ? response.data : [];

    // Properly format the images array to match the expected type
    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map((image: { image_path: string }) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }));

  } catch (error: any) {
    console.error('Error fetching real-time tourist attractions:', error);
    throw new Error(error.response?.data?.error || 'Error fetching real-time tourist attractions');
  }
};



// Function to search places
export const searchPlaces = async (query: string): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/search?q=${query}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: typeof place.image_url === 'string'
        ? place.image_url.split(',').map(imagePath => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${imagePath.trim()}`)
        : []
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};

// Function to fetch all tourism data
export const getAllFetchTouristEntities= async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places');
    const data = Array.isArray(response.data) ? response.data : [];
    
    return data.map(place => ({
      ...place,
      image_path: place.image_path ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${place.image_path}` : null,
    }));
  } catch (error) {
    console.error('Error fetching tourism data:', error);
    throw error;
  }
};

// Function to fetch tourist attractions
export const fetchTouristAttractions = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/tourist-attractions');
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error) {
    console.error('Error fetching tourist attractions:', error);
    throw error;
  }
};

// Function to fetch accommodations
export const fetchAccommodations = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/accommodations');
    return response.data;
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    throw error;
  }
};

// Function to fetch restaurants
export const fetchRestaurants = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/restaurants');
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

// Function to fetch souvenir shops
export const fetchSouvenirShops = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/souvenir-shops');
    return response.data;
  } catch (error) {
    console.error('Error fetching souvenir shops:', error);
    throw error;
  }
};

// Function to fetch nearby tourism data
export const getNearbyFetchTourismData = async (id: number, radius = 5000): Promise<EntityResponse> => {
  try {
    const response: AxiosResponse<EntityResponse> = await api.get(`/place/nearby/${id}?radius=${radius}`);
    const { entity, nearbyEntities } = response.data;

    // Map images for the main entity
    if (entity.images && Array.isArray(entity.images)) {
      entity.images = entity.images.map(image => ({
        ...image,
        image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
      }));
    }

    // Map images for the nearby entities
    if (nearbyEntities && Array.isArray(nearbyEntities)) {
      nearbyEntities.forEach(entity => {
        if (entity.images && Array.isArray(entity.images)) {
          entity.images = entity.images.map(image => ({
            ...image,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }));
        }
      });
    }

    return { entity, nearbyEntities };
  } catch (error) {
    console.error('Error fetching tourism data:', error);
    throw error;
  }
};

// Function to fetch currently open tourist entities
export const fetchCurrentlyOpenTouristEntities = async (): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/places/currently-open');
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map((image: { image_path: string }) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }));
  } catch (error) {
    console.error('Error fetching currently open tourist entities:', error);
    throw error;
  }
};

// Function to fetch tourist attractions by district
export const fetchTouristAttractionsByDistrict = async (districtId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/tourist-attractions/${districtId}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error) {
    console.error('Error fetching tourist attractions by district:', error);
    throw error;
  }
};

// Function to fetch accommodations by district
export const fetchAccommodationsByDistrict = async (districtId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/accommodations/${districtId}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error) {
    console.error('Error fetching accommodations by district:', error);
    throw error;
  }
};

// Function to fetch restaurants by district
export const fetchRestaurantsByDistrict = async (districtId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/restaurants/${districtId}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error) {
    console.error('Error fetching restaurants by district:', error);
    throw error;
  }
};

// Function to fetch souvenir shops by district
export const fetchSouvenirShopsByDistrict = async (districtId: number): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/souvenir-shops/${districtId}`);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error) {
    console.error('Error fetching souvenir shops by district:', error);
    throw error;
  }
};

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinates = async (latitude: number, longitude: number, radius = 5000): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/places/nearby-by-coordinates`, {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radius
      }
    });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map((image: { image_path: string }) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }));
    
  } catch (error: any) {
    console.error('Error fetching places nearby by coordinates:', error);
    throw new Error(error.response?.data?.error || 'Error fetching places nearby by coordinates');
  }
};

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinatesRealTime = async (latitude: number, longitude: number, radius = 5000): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get(`/places/nearby-by-coordinates`, {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radius
      }
    });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      image_url: place.images ? place.images.map(image => `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`) : []
    }));
  } catch (error: any) {
    console.error('Error fetching places nearby by coordinates:', error);
    throw new Error(error.response?.data?.error || 'Error fetching places nearby by coordinates');
  }
};


// Unified search for all criteria
export const searchTouristEntitiesUnified = async (params: Record<string, string | number>): Promise<Place[]> => {
  try {
    const response: AxiosResponse<Place[]> = await api.get('/search', { params });
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map((image: { image_path: string }) => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }));
  } catch (error: any) {
    console.error('Error fetching tourist entities with unified search:', error);
    throw new Error(error.response?.data?.error || 'Error fetching tourist entities with unified search');
  }
};

// Fetch all filters (seasons, districts, categories)
export const fetchAllFilters = async (): Promise<{ seasons: Season[], districts: District[], categories: Category[] }> => {
  try {
    const response: AxiosResponse<{ seasons: Season[], districts: District[], categories: Category[] }> = await api.get('/filters');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all filters:', error);
    throw new Error(error.response?.data?.error || 'Error fetching all filters');
  }
};