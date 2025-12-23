export interface Product {
    id: number;
    title: string;
    sellerId: number;
    description: string;
    price: number;
    category: string
    universityName: string;
    images: string[] | null;
    isFavourite: boolean;
    status: string;
    favouriteCount: number | null;
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
    category?: string;
    keyword?: string;
}

export interface FavouritesResponse {
    id: number;
    userId: number;
    productId: number;
}