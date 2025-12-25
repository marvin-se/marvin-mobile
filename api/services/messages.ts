import { Conversation, ConversationListResponse } from "@/types/api"
import { apiClient } from "../config"

export const messagesService = {
    getConversations: async (): Promise<ConversationListResponse> => {
        const response = await apiClient.get<ConversationListResponse>("/messages")
        return response.data
    },

    getConversation: async (otherUserId: string | number, productId: string | number): Promise<Conversation> => {
        const response = await apiClient.get<Conversation>(`/messages/conversations/${otherUserId}/${productId}`)
        return response.data
    }
}
