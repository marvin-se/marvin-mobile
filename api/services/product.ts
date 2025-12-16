import { apiClient } from "../config"

import { CreateProductRequest, Product } from "@/types/api"

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>("/listings")
        return response.data
    },

    createProduct : async(data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>("/listings", data)
        return response.data
    }
}