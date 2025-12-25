import { messagesService } from '@/api/services/messages'
import { productService } from '@/api/services/product'
import { useAuthStore } from '@/store/useAuthStore'
import { Conversation } from '@/types/api'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

// Import the hook
import { useChatWebSocket } from '@/hooks/useChatWebSocket'
import { useProductStore } from '@/store/useProductStore'
import { getAvatarUrl } from '@/utils/avatar'
import { getToken } from '@/utils/storage'

const Chats = () => {


    const { imageUrlCache, cacheImageUrls } = useProductStore();


    // 1. Get Params
    const { id: otherUserIdParam, productId } = useLocalSearchParams();
    const otherUserId = Number(otherUserIdParam); // Ensure number for logic
    const { user } = useAuthStore();
    const [token, setToken] = useState<string | null>(null);

    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMarkingSold, setIsMarkingSold] = useState(false);
    const [messageText, setMessageText] = useState('');

    // Handle Mark as Sold
    const handleMarkAsSold = async () => {
        const product = conversation?.product;
        if (!product) return;

        Alert.alert(
            "Mark as Sold",
            "Are you sure you want to mark this item as sold? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Mark as Sold",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsMarkingSold(true);
                            await productService.updateProductStatus(product.id, 'SOLD', conversation?.id);

                            // Update local state
                            setConversation(prev => {
                                if (!prev || !prev.product) return prev;
                                return {
                                    ...prev,
                                    product: {
                                        ...prev.product,
                                        status: 'SOLD'
                                    }
                                };
                            });

                            Toast.show({ type: 'success', text1: 'Success', text2: 'Item marked as sold' });
                        } catch (error) {
                            console.error("Failed to mark as sold", error);
                            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to mark item as sold' });
                        } finally {
                            setIsMarkingSold(false);
                        }
                    }
                }
            ]
        );
    };

    // Ref for scroll to bottom
    const scrollViewRef = useRef<ScrollView>(null);

    // Fetch token on mount
    useEffect(() => {
        getToken().then(t => setToken(t));
    }, []);

    // 2. Fetch Initial History
    useEffect(() => {
        const fetchConversation = async () => {
            if (!otherUserId) return;
            try {
                setIsLoading(true);
                // Handle case where productId param might be the string "undefined"
                const cleanProductId = (productId && productId !== 'undefined') ? productId : undefined;

                const data = await messagesService.getConversation(otherUserId.toString(), cleanProductId as string);
                setConversation(data);
            } catch (error) {
                console.error("Failed to fetch conversation", error);
                Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load conversation' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversation();
    }, [otherUserId, productId]);

    // Added: Fetch signed images if needed
    useEffect(() => {
        const loadSignedImages = async () => {
            const currentProductId = Number(productId);

            // Basic checks: have a product, have images, and not already cached
            if (!conversation?.product?.images?.length) return;

            // If already in cache (and not empty array), we are good - component reads from cache
            if (imageUrlCache[currentProductId] && imageUrlCache[currentProductId].length > 0) return;

            const firstImage = conversation.product.images[0];

            // Only fetch if it looks like a raw S3 key (starts with 'products/')
            // If it's a full http/https URL, might not need signing (unless your system always requires it)
            if (firstImage.startsWith('products/')) {
                try {
                    const response = await productService.getProductImages(currentProductId);
                    if (response.images && response.images.length > 0) {
                        const urls = response.images.map(img => img.url);
                        cacheImageUrls(currentProductId, urls);
                    }
                } catch (error) {
                    console.error("Failed to load signed images for chat product", error);
                }
            }
        };

        if (conversation?.product && productId) {
            loadSignedImages();
        }
    }, [conversation, productId, imageUrlCache]);


    // 3. Helper to handle incoming socket message
    // The socket response doesn't have senderId, so we infer it based on receiverId
    const handleNewMessage = (socketMsg: any) => {
        if (!conversation || !user) return;

        // Logic: If I am the receiver, the sender is the 'other user'. 
        // If I am NOT the receiver, I am the sender.
        const isMeReceiver = socketMsg.receiverId === user.id;
        const senderId = isMeReceiver ? otherUserId : user.id;

        const newMessage = {
            id: socketMsg.messageId,
            content: socketMsg.content,
            sentAt: socketMsg.sentAt,
            senderId: senderId,
            receiverId: socketMsg.receiverId,
            read: false
        };

        setConversation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                messages: [...(prev.messages || []), newMessage]
            };
        });

        // Scroll to bottom shortly after render
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    // 4. Initialize WebSocket Hook
    const { isConnected, sendMessage } = useChatWebSocket({
        conversationId: conversation?.id, // Will be null initially, so hook waits
        token: token || '',
        onMessageReceived: handleNewMessage
    });

    // 5. Send Handler
    const handleSend = () => {
        if (!messageText.trim() || !conversation) return;

        const success = sendMessage(
            Number(productId),
            otherUserId,
            messageText
        );

        if (success) {
            setMessageText('');
        } else {
            Toast.show({ type: 'error', text1: 'Connection Error', text2: 'Not connected to chat server.' });
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView className='bg-background h-full items-center justify-center'>
                <ActivityIndicator size="large" color="#72C69B" />
            </SafeAreaView>
        )
    }

    const userAvatar = getAvatarUrl(conversation?.username);

    // Determine the product image to show
    let productImageSource = null;
    if (conversation?.product) {
        const prodId = conversation.product.id;
        // Check cache first
        if (imageUrlCache[prodId] && imageUrlCache[prodId].length > 0) {
            productImageSource = { uri: imageUrlCache[prodId][0] };
        }
        // Fallback to original if available
        else if (conversation.product.images && conversation.product.images.length > 0) {
            productImageSource = { uri: conversation.product.images[0] };
        }
    }

    return (
        <SafeAreaView className='bg-background h-full'>
            <KeyboardAvoidingView
                className='flex-1'
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={4}
            >
                {/* HEADER */}
                <View className='px-5 border-b border-b-borderPrimary pb-4 mb-2'>
                    <View className="flex flex-row items-center justify-center mt-5 relative">
                        <TouchableOpacity
                            className='flex-row items-center gap-4'
                            onPress={() => router.push({
                                pathname: `/profile/[userId]`,
                                params: {
                                    userId: String(otherUserId),
                                    name: conversation?.username || '',
                                }
                            })}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{ uri: userAvatar }}
                                style={{ width: 48, height: 48, borderRadius: 9999 }}
                                contentFit='cover'
                            />
                            <Text className='text-textPrimary font-bold text-lg' numberOfLines={1}>
                                {conversation?.username || "User"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className='absolute left-0' onPress={() => router.back()} activeOpacity={0.5}>
                            <MaterialIcons name="arrow-back" size={32} color="black" />
                        </TouchableOpacity>

                        {/* Connection Status Indicator (Optional Debugging) */}
                        <View className={`absolute right-0 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    </View>
                </View>

                {/* PRODUCT INFO */}
                {conversation?.product && (
                    <View className="mx-5 mb-4 p-3 bg-white rounded-lg border border-borderPrimary flex-row items-center gap-3 shadow-sm shadow-gray-100">
                        {productImageSource ? (
                            <Image
                                source={productImageSource}
                                style={{ width: 48, height: 48, borderRadius: 8 }}
                                contentFit='cover'
                            />
                        ) : (
                            conversation.product.status !== 'SOLD' && (
                                <View className="w-12 h-12 bg-gray-200 rounded-lg items-center justify-center">
                                    <MaterialIcons name="image" size={24} color="gray" />
                                </View>
                            )
                        )}
                        <View className="flex-1">
                            <Text className="text-textPrimary font-semibold" numberOfLines={1}>
                                {conversation.product.title}
                            </Text>
                            <Text className="text-primary font-bold">
                                ${conversation.product.price}
                                {conversation.product.status === 'SOLD' && (
                                    <Text className="text-red-500 font-bold ml-2"> • SOLD</Text>
                                )}
                            </Text>
                        </View>

                        {conversation.product.status !== 'SOLD' && conversation.product.sellerId === user?.id && (
                            <TouchableOpacity
                                onPress={handleMarkAsSold}
                                disabled={isMarkingSold}
                                className={`px-3 py-2 rounded-lg border border-gray-200 ${isMarkingSold ? 'bg-gray-100' : 'bg-gray-200'}`}
                            >
                                {isMarkingSold ? (
                                    <ActivityIndicator size="small" color="#6B7280" />
                                ) : (
                                    <Text className="text-textSecondary font-bold text-xs">Mark as sold</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* MESSAGES LIST */}
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {conversation?.messages?.map((message, index) => {
                        const isSentByMe = message.senderId === user?.id;
                        return (
                            <View key={index} className={`px-5 mb-3 ${isSentByMe ? 'items-end' : 'items-start'}`}>
                                <View className={`${isSentByMe ? 'bg-primary' : 'bg-borderPrimary'} rounded-lg p-3 max-w-[80%]`}>
                                    <Text className={`${isSentByMe ? 'text-white' : 'text-textPrimary'}`}>{message.content}</Text>
                                </View>
                                <Text className='text-textSecondary text-xs mt-1'>
                                    {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        )
                    })}
                </ScrollView>

                {/* INPUT AREA */}
                {conversation?.product?.status === 'SOLD' ? (
                    <View className='border-t border-borderPrimary px-5 py-6 bg-gray-50 flex-row items-center justify-center gap-2 mb-safe'>
                        <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" />
                        <Text className='text-textSecondary font-medium'>
                            This item is sold. Chat is closed.
                        </Text>
                    </View>
                ) : (
                    <View className='border-t border-borderPrimary px-5 py-3 bg-white flex-row items-center gap-4'>
                        <TouchableOpacity onPress={() => { }} activeOpacity={0.5}>
                            <AntDesign name="plus-circle" size={20} color="#72C69B" />
                        </TouchableOpacity>
                        <View className='flex-1'>
                            <TextInput
                                className='px-4 py-2.5 bg-background rounded-full text-textPrimary'
                                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                                value={messageText}
                                onChangeText={setMessageText}
                                editable={isConnected} // Disable if not connected
                            ></TextInput>
                        </View>
                        <TouchableOpacity
                            className={`w-12 h-12 rounded-full items-center justify-center ${isConnected ? 'bg-primary' : 'bg-gray-400'}`}
                            onPress={handleSend}
                            activeOpacity={0.5}
                            disabled={!isConnected}
                        >
                            <MaterialIcons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Chats