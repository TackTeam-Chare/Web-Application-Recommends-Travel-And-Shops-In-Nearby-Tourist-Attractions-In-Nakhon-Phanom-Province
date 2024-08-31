import { ReactNode } from 'react';

// Base interface for entities with an ID and name
interface BaseEntity {
  id: number;
  name: string;
  [key: string]: any;
}

// Interface for Place entity
export interface Place extends BaseEntity {
  description: string;
  image_path?: string | null;
  image_url?: string | string[] | null;
  images?: {
    image_url: string | undefined;
    image_path: string;
  }[];
}

// Interface for responses involving a Place entity and nearby entities
export interface EntityResponse {
  entity: Place;
  nearbyEntities: Place[];
}

// Generic interface for fetch responses
export interface FetchResponse<T> {
  data: T;
}

// Interfaces for other entities extending the BaseEntity interface
export interface Season extends BaseEntity {}

export interface District extends BaseEntity {}

export interface Category extends BaseEntity {}

// Interface for update data and responses
export interface UpdateData {
  [key: string]: any;
}

export interface UpdateResponse {
  [key: string]: any;
}

// Interface for user profile
export interface Profile {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

// Interface for authentication responses
export interface AuthResponse {
  token: string;
  [key: string]: any;
}

// Interface for image data
export interface Image {
  id: number;
  image_path?: string | null;
  image_url?: string | null;
  [key: string]: any;
}

// Interface for pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Interface for PlaceCard component props
export interface PlaceCardProps {
  place: Place;
}

// Interface for Layout component props
export interface LayoutProps {
  children: ReactNode;
}

// Interface for Params
export interface Params {
  id: string;
}

// Interface for Admin form data
export interface AdminFormData {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'primary' | 'secondary';
}

// Interface for Admin entity
export interface Admin extends BaseEntity {
  username: string;
  role: string;
}

// Interface for Category form data
export interface CategoryFormData {
  name: string;
}

// Generic form data interface
export interface FormData {
  name: string;
}
