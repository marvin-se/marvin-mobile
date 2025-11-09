import mockProducts from '@/data/mockProducts';
import { create } from 'zustand';

export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    seller: string;
    isFavorite: boolean;
}

interface ProductStore {
    products: Product[];
    toggleFavorite: (productId: string) => void;
    getFavorites: () => Product[];
}

const initialProducts: Product[] = mockProducts;

export const useProductStore = create<ProductStore>((set, get) => ({
    products: initialProducts,

    toggleFavorite: (productId: string) => {
        set((state) => ({
            products: state.products.map((product) =>
                product.id === productId
                    ? { ...product, isFavorite: !product.isFavorite }
                    : product
            ),
        }))
    },

    getFavorites: () => {
        return get().products.filter((product) => product.isFavorite)
    },
}))
