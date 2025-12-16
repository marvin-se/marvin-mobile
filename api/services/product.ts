import { apiClient } from "../config"

import { Product } from "@/types/api"

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>("/listings")
        return response.data
    }
}