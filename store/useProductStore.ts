import { create } from 'zustand';
import { productService } from '@/api/services/product';
import { CreateProductRequest, FilterParams, Product } from '@/types/api';
import { filterService } from '@/api/services/filter';

interface ProductStore {
    products: Product[];
    cache: Record<string, Product[]>;
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    filterProducts: (params: FilterParams) => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<Product>;
    clearCache: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    cache: {},
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        const { cache } = get();

        if (cache['ALL']) {
            set({ products: cache['ALL'] });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const products = await productService.getProducts();
            set({ products, cache: { ...get().cache, "ALL": products }, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch products',
                isLoading: false
            });
        }
    },

    filterProducts: async (params: FilterParams) => {
        const { cache } = get();
        const cacheKey = params.category || 'ALL';

        if (cache[cacheKey]) {
            set({ products: cache[cacheKey] });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            if (!params.category || params.category === 'ALL') {
                const products = await productService.getProducts();
                set({ products, cache: { ...get().cache, "ALL": products }, isLoading: false });
            } else {
                const products = await filterService.filterProducts(params);
                set({ products, cache: { ...get().cache, [cacheKey]: products }, isLoading: false });
            }
        } catch (error: any) {
            set({
                error: error.message || 'Failed to filter products',
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
                cache: {},
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

    clearCache: () => {
        set({ cache: {} });
    }
}))
