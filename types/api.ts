export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string
    universityName: string;
    images: string[] | null;
    favoriteCount: number | null;
    visitCount: number | null;
}

export interface CreateProductRequest {
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

export interface FilterParams {
    category: string;
}