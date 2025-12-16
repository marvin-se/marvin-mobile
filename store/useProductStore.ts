import { create } from 'zustand';
import { productService } from '@/api/services/product';
import { CreateProductRequest, Product } from '@/types/api';

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<Product>;
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
    },

    createProduct: async (data: CreateProductRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newProduct = await productService.createProduct(data);
            set((state) => ({
                products: [newProduct, ...state.products],
                isLoading: false
            }));
            return newProduct;
        } catch (error: any) {
            set({
                error: error.message || 'Failed to create product',
                isLoading: false
            });
            throw error;
        }
    },
}))
