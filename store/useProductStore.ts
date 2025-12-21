import { favouritesService } from '@/api/services/favourites';
import { filterService } from '@/api/services/filter';
import { productService } from '@/api/services/product';
import { CreateProductRequest, FilterParams, Product } from '@/types/api';
import { create } from 'zustand';

interface ProductStore {
    products: Product[];
    favoriteProducts: Product[];
    cache: Record<string, Product[]>;
    isLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    fetchFavoriteProducts: () => Promise<void>;
    addFavoriteProduct: (productId: number) => Promise<void>;
    removeFavoriteProduct: (productId: number) => Promise<void>;
    filterProducts: (params: FilterParams) => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<Product>;
    clearCache: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    favoriteProducts: [],
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

    fetchFavoriteProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const favoriteProductIds = await favouritesService.getFavourites();
            const allProducts = await productService.getProducts();
            const favoriteProducts = allProducts.filter(product =>
                favoriteProductIds.some(fav => fav.productId === product.id)
            );
            set({ favoriteProducts, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch favorite products',
                isLoading: false
            });
        }
    },

    addFavoriteProduct: async (productId: number) => {
        const { products, favoriteProducts } = get();
        const previousFavoriteProducts = [...favoriteProducts];

        const productToAdd = products.find(p => p.id === productId);

        if (productToAdd) {
            const isAlreadyFavorite = favoriteProducts.some(p => p.id === productId);
            if (!isAlreadyFavorite) {
                set({
                    favoriteProducts: [...favoriteProducts, productToAdd],
                });
            }
        }

        try {
            await favouritesService.addFavourite(productId);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                favoriteProducts: previousFavoriteProducts,
                error: error.message || 'Failed to add favorite product',
                isLoading: false
            });
        }
    },

    removeFavoriteProduct: async (productId: number) => {
        const { products, favoriteProducts } = get();
        const previousFavoriteProducts = [...favoriteProducts];

        const productToRemove = favoriteProducts.find(p => p.id === productId);

        if (productToRemove) {
            set({
                favoriteProducts: favoriteProducts.filter(p => p.id !== productId),
            });
        }

        try {
            await favouritesService.removeFavourite(productId);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                favoriteProducts: previousFavoriteProducts,
                error: error.message || 'Failed to remove favorite product',
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
