import { ReactNode } from "react";

export interface Place {
    id: number;
    name: string;
    description: string;
    image_path?: string | null;
    image_url?: string | string[] | null;
    images?: { image_path: string }[];
    [key: string]: any;
}

export interface EntityResponse {
    entity: Place;
    nearbyEntities: Place[];
}

export interface FetchResponse<T> {
    data: T;
}

export interface Season {
    id: number;
    name: string;
    [key: string]: any;
}

export interface District {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Category {
    id: number;
    name: string;
    [key: string]: any;
}

export interface UpdateData {
    [key: string]: any;
}

export interface UpdateResponse {
    [key: string]: any;
}

export interface Profile {
    id: number;
    name: string;
    email: string;
    [key: string]: any;
}

export interface AuthResponse {
    token: string;
    [key: string]: any;
}

export interface Image {
    id: number;
    image_path?: string | null;
    image_url?: string | null;
    [key: string]: any;
}

export interface Admin extends Profile {
    role: string;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }

export interface PlaceCardProps {
    place: Place;
  }

export interface LayoutProps {
    children: ReactNode;
  }
  