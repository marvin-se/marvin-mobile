import { create } from 'zustand';
import { productService } from '@/api/services/product';
import { Product } from '@/types/api';

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const products = await productService.getProducts();
            set({ products, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch products',
                isLoading: false
            });
        }
    }
}))
