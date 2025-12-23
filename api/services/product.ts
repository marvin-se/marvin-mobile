import { apiClient } from "../config"

import { CreateProductRequest, Product } from "@/types/api"

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>("/listings")
        return response.data
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await apiClient.get<Product>(`/listings/${id}`)
        return response.data
    },

    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post<Product>("/listings", data)
        return response.data
    },

    updateProduct: async (id: number, data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.put<Product>(`/listings/${id}`, data)
        return response.data
    },

    getUserListings: async (userId: number): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>(`/user/${userId}/listings`)
        return response.data
    },

    updateProductStatus: async (id: number, status: string): Promise<Product> => {
        const response = await apiClient.put<Product>(`/listings/${id}/mark-sold`, { status })
        return response.data
    },

    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/listings/${id}`)
    },
}