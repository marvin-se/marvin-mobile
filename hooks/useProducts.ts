import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";

export const useProducts = () => {
    const { products, isLoading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, isLoading, error };
}