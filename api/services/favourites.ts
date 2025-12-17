import { FavouritesResponse, Product } from "@/types/api";
import apiClient from "../config";

export const favouritesService = {
    getFavourites: async (userId: number): Promise<FavouritesResponse[]> => {
        const response = await apiClient.get("/favourites/" + userId);
        return response.data;
    },

    addFavourite: async (userId: number, productId: number): Promise<FavouritesResponse> => {
        const response = await apiClient.post("/favourites/" + userId, {
            userId,
            productId
        });
        return response.data;
    },

    removeFavourite: async (userId: number, productId: number): Promise<void> => {
        await apiClient.delete("/favourites/" + userId + "/" + productId);
    }
}