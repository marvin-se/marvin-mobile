import { apiClient } from "../config"

import { AttachImagesRequest, AttachImagesResponse, CreateProductRequest, PresignImageRequest, PresignImageResponse, Product } from "@/types/api"

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

    getPresignedUrls: async (adId: number, data: PresignImageRequest): Promise<PresignImageResponse> => {
        const response = await apiClient.post<PresignImageResponse>(`/listings/${adId}/images/presign`, data)
        return response.data
    },

    uploadImageToS3: async (uploadUrl: string, imageUri: string, contentType: string): Promise<void> => {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: {
                'Content-Type': contentType,
            },
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload image to S3');
        }
    },

    attachImages: async (adId: number, data: AttachImagesRequest): Promise<AttachImagesResponse> => {
        const response = await apiClient.post<AttachImagesResponse>(`/listings/${adId}/images`, data)
        return response.data
    },

    publishProduct: async (adId: number): Promise<void> => {
        await apiClient.put(`/listings/${adId}/publish`)
    },

    getProductImages: async (adId: number): Promise<AttachImagesResponse> => {
        const response = await apiClient.get<AttachImagesResponse>(`/listings/${adId}/images`)
        return response.data
    },

    getSalesHistory: async (): Promise<any[]> => {
        const response = await apiClient.get<any[]>("/user/sales")
        return response.data
    },

    getPurchasesHistory: async (): Promise<any[]> => {
        const response = await apiClient.get<any[]>("/user/purchases")
        return response.data
    },
}