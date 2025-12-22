import { FavouritesResponse, Product } from "@/types/api";
import apiClient from "../config";

export const favouritesService = {
    getFavourites: async (): Promise<FavouritesResponse[]> => {
        const response = await apiClient.get("/favourites/getAll");
        return response.data;
    },

    addFavourite: async (productId: number): Promise<FavouritesResponse> => {
        const response = await apiClient.post("/favourites/add", {
            productId
        });
        return response.data;
    },

    removeFavourite: async (productId: number): Promise<void> => {
        await apiClient.delete("/favourites/" + productId);
    }
}