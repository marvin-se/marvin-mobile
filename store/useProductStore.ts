import { favouritesService } from '@/api/services/favourites';
import { productService } from '@/api/services/product';
import { CreateProductRequest, FilterParams, Product } from '@/types/api';
import { create } from 'zustand';

interface UserStats {
    activeListings: number;
    soldItems: number;
}

interface ProductStore {
    products: Product[];
    favoriteProducts: Product[];
    favoriteProductIds: number[];
    cache: Record<string, Product[]>;
    isLoading: boolean;
    isProductsLoading: boolean;
    error: string | null;

    fetchProducts: () => Promise<void>;
    fetchFavoriteProducts: () => Promise<void>;
    addFavoriteProduct: (productId: number) => Promise<void>;
    removeFavoriteProduct: (productId: number) => Promise<void>;
    filterProducts: (params: FilterParams) => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<Product>;
    updateProduct: (productId: number, data: CreateProductRequest) => Promise<Product>;
    deleteProduct: (productId: number) => Promise<void>;
    updateProductStatus: (productId: number, status: string) => Promise<void>;
    refreshProducts: () => Promise<void>;
    getUserStats: (userId: number) => UserStats;
    getUserListings: (userId: number) => Product[];
    clearCache: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    favoriteProducts: [],
    favoriteProductIds: [],
    cache: {},
    isLoading: false,
    isProductsLoading: false,
    error: null,

    fetchProducts: async () => {
        const { cache, favoriteProductIds } = get();

        if (cache['ALL']) {
            const allProducts = cache['ALL'];
            set({
                products: allProducts,
                favoriteProducts: allProducts.filter(p => favoriteProductIds.includes(p.id))
            });
            return;
        }

        set({ isLoading: true, isProductsLoading: true, error: null });
        try {
            const products = await productService.getProducts();
            set({
                products,
                cache: { ...get().cache, "ALL": products },
                favoriteProducts: products.filter(p => get().favoriteProductIds.includes(p.id)),
                isLoading: false,
                isProductsLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch products',
                isLoading: false,
                isProductsLoading: false
            });
        }
    },

    fetchFavoriteProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const favoritesData = await favouritesService.getFavourites();
            const favoriteids = favoritesData.map(f => f.productId);

            const { products } = get();

            const favoriteProducts = products.length > 0
                ? products.filter(product => favoriteids.includes(product.id))
                : [];

            set({
                favoriteProductIds: favoriteids,
                favoriteProducts: favoriteProducts,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch favorite products',
                isLoading: false
            });
        }
    },

    addFavoriteProduct: async (productId: number) => {
        const { products, favoriteProducts, favoriteProductIds } = get();
        const previousFavoriteProducts = [...favoriteProducts];
        const previousFavoriteIds = [...favoriteProductIds];

        const productToAdd = products.find(p => p.id === productId);

        if (productToAdd) {
            const isAlreadyFavorite = favoriteProductIds.includes(productId);
            if (!isAlreadyFavorite) {
                set({
                    favoriteProducts: [...favoriteProducts, productToAdd],
                    favoriteProductIds: [...favoriteProductIds, productId]
                });
            }
        }

        try {
            await favouritesService.addFavourite(productId);
        } catch (error: any) {
            set({
                favoriteProducts: previousFavoriteProducts,
                favoriteProductIds: previousFavoriteIds,
                error: error.message || 'Failed to add favorite product',
                isLoading: false
            });
        }
    },

    removeFavoriteProduct: async (productId: number) => {
        const { favoriteProducts, favoriteProductIds } = get();
        const previousFavoriteProducts = [...favoriteProducts];
        const previousFavoriteIds = [...favoriteProductIds];

        set({
            favoriteProducts: favoriteProducts.filter(p => p.id !== productId),
            favoriteProductIds: favoriteProductIds.filter(id => id !== productId)
        });

        try {
            await favouritesService.removeFavourite(productId);
        } catch (error: any) {
            set({
                favoriteProducts: previousFavoriteProducts,
                favoriteProductIds: previousFavoriteIds,
                error: error.message || 'Failed to remove favorite product',
                isLoading: false
            });
        }
    },

    filterProducts: async (params: FilterParams) => {
        const { cache, favoriteProductIds } = get();

        let allProducts = cache['ALL'];

        if (!allProducts) {
            set({ isLoading: true, error: null });
            try {
                allProducts = await productService.getProducts();
                set({ cache: { ...get().cache, "ALL": allProducts } });
            } catch (error: any) {
                set({
                    error: error.message || 'Failed to fetch products for filtering',
                    isLoading: false
                });
                return;
            }
        }

        let filteredProducts = allProducts;
        if (params.category && params.category !== 'ALL') {
            filteredProducts = allProducts.filter(p => p.category === params.category);
        }

        set({
            products: filteredProducts,
            favoriteProducts: filteredProducts.filter(p => favoriteProductIds.includes(p.id)),
            isLoading: false
        });

        // Server-side logic kept as reference/fallback if needed later
        /*
        const cacheKey = params.category || 'ALL';
        if (cache[cacheKey]) {
            set({ products: cache[cacheKey] });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            if (!params.category || params.category === 'ALL') {
                 // ...
            } else {
                const products = await filterService.filterProducts(params);
                set({ products, cache: { ...get().cache, [cacheKey]: products }, isLoading: false });
            }
        } ...
        */
    },

    createProduct: async (data: CreateProductRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newProduct = await productService.createProduct(data);
            const { products, cache } = get();
            const updatedAll = [newProduct, ...(cache['ALL'] || [])];

            set((state) => ({
                products: [newProduct, ...state.products],
                cache: { ...state.cache, 'ALL': updatedAll },
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

    updateProduct: async (productId: number, data: CreateProductRequest) => {
        set({ isLoading: true, error: null });
        try {
            const updatedProduct = await productService.updateProduct(productId, data);
            const { products, cache, favoriteProducts, favoriteProductIds } = get();

            const updateProductInArray = (arr: Product[]) =>
                arr.map(p => p.id === productId ? updatedProduct : p);

            const updatedCache = { ...cache };
            Object.keys(updatedCache).forEach(key => {
                updatedCache[key] = updateProductInArray(updatedCache[key]);
            });

            set({
                products: updateProductInArray(products),
                cache: updatedCache,
                favoriteProducts: favoriteProductIds.includes(productId) 
                    ? updateProductInArray(favoriteProducts) 
                    : favoriteProducts,
                isLoading: false
            });

            return updatedProduct;
        } catch (error: any) {
            set({
                error: error.message || 'Failed to update product',
                isLoading: false
            });
            throw error;
        }
    },

    deleteProduct: async (productId: number) => {
        const { products, cache, favoriteProducts, favoriteProductIds } = get();

        const updatedProducts = products.filter(p => p.id !== productId);
        const updatedCache = { ...cache };

        Object.keys(updatedCache).forEach(key => {
            updatedCache[key] = updatedCache[key].filter(p => p.id !== productId);
        });

        set({
            products: updatedProducts,
            cache: updatedCache,
            favoriteProducts: favoriteProducts.filter(p => p.id !== productId),
            favoriteProductIds: favoriteProductIds.filter(id => id !== productId),
        });

        try {
            await productService.deleteProduct(productId);
        } catch (error: any) {
            set({ products, cache, favoriteProducts, favoriteProductIds });
            throw error;
        }
    },

    updateProductStatus: async (productId: number, status: string) => {
        const { products, cache } = get();

        const updateProduct = (p: Product) =>
            p.id === productId ? { ...p, status: status as Product['status'] } : p;

        const updatedProducts = products.map(updateProduct);
        const updatedCache = { ...cache };

        Object.keys(updatedCache).forEach(key => {
            updatedCache[key] = updatedCache[key].map(updateProduct);
        });

        set({
            products: updatedProducts,
            cache: updatedCache,
        });

        try {
            await productService.updateProductStatus(productId, status);
        } catch (error: any) {
            set({ products, cache });
            throw error;
        }
    },

    refreshProducts: async () => {
        set({ cache: {} });
        await get().fetchProducts();
    },

    getUserStats: (userId: number): UserStats => {
        const { products } = get();
        const userProducts = products.filter(p => p.sellerId === userId);

        return {
            activeListings: userProducts.filter(p => p.status === "ACTIVE" || !p.status).length,
            soldItems: userProducts.filter(p => p.status === "SOLD").length,
        };
    },

    getUserListings: (userId: number): Product[] => {
        const { products } = get();
        return products.filter(p => p.sellerId === userId);
    },

    clearCache: () => {
        set({ cache: {} });
    }
}))
