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