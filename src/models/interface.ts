export interface Place {
    id: number;
    name: string;
    image_path?: string | null; // The image path, which can be undefined or null
    image_url?: string | string[] | null; // URL(s) of the image, can be a string, array of strings, or null
    images?: { image_path: string }[]; // An array of objects each containing an image path
    [key: string]: any; // Allows additional properties
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
    [key: string]: any; // Allows additional properties
}

export interface District {
    id: number;
    name: string;
    [key: string]: any; // Allows additional properties
}

export interface Category {
    id: number;
    name: string;
    [key: string]: any; // Allows additional properties
}

export interface UpdateData {
    [key: string]: any; // Used for update operations, flexible structure
}

export interface UpdateResponse {
    [key: string]: any; // Response structure for update operations
}

export interface Profile {
    id: number;
    name: string;
    email: string;
    [key: string]: any; // Allows additional properties
}

export interface AuthResponse {
    token: string; // The authentication token
    [key: string]: any; // Allows additional fields, such as user info, roles, etc.
}

export interface Image {
    id: number;
    image_path?: string | null; // Path to the image, can be undefined or null
    image_url?: string | null; // URL to the image, can be undefined or null
    [key: string]: any; // Allows additional properties
}

export interface Admin extends Profile {
    role: string; // Role of the admin, extends Profile
}
