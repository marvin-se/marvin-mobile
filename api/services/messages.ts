import { ConversationListResponse } from "@/types/api"
import { apiClient } from "../config"

export const messagesService = {
    getConversations: async (): Promise<ConversationListResponse> => {
        const response = await apiClient.get<ConversationListResponse>("/messages")
        return response.data
    }
}
