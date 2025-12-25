import { Conversation, ConversationListResponse } from "@/types/api"
import { apiClient } from "../config"

export const messagesService = {
    getConversations: async (): Promise<ConversationListResponse> => {
        const response = await apiClient.get<ConversationListResponse>("/messages")
        return response.data
    },

    getConversation: async (otherUserId: string | number, productId?: string | number): Promise<Conversation> => {
        const url = productId
            ? `/messages/conversations/${otherUserId}/${productId}`
            : `/messages/conversations/${otherUserId}`

        const response = await apiClient.get<Conversation>(url)
        return response.data
    }
}
