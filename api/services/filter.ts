import { FilterParams, Product } from "@/types/api";
import apiClient from "../config";

export const filterService = {
    filterProducts: async (params: FilterParams): Promise<Product[]> => {
        const response = await apiClient.get("/search/filter", {
            params,
        });
        return response.data.products;
    }
}