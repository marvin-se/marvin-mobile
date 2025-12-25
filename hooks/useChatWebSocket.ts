import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

// Derive the socket URL from the public API URL to ensure consistency
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/campustrade';
// Example: http://localhost:8080/campustrade -> ws://localhost:8080/campustrade/wst
const SOCKET_URL = API_URL.replace(/^http/, 'ws') + '/wst';

console.log('🔌 WebSocket URL:', SOCKET_URL);

interface UseChatWebSocketProps {
    conversationId?: number;
    token: string;
    onMessageReceived: (message: any) => void;
}

export const useChatWebSocket = ({ conversationId, token, onMessageReceived }: UseChatWebSocketProps) => {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Only connect if we have both a token and a specific conversation ID
        if (!token || !conversationId) return;

        const client = new Client({
            brokerURL: SOCKET_URL,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            // Specific configs for React Native
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,

            debug: (str) => console.log('STOMP: ' + str),
            onWebSocketError: (error) => console.error('WebSocket Error: ', error),

            onConnect: () => {
                setIsConnected(true);
                console.log(`Connected to WS for Conversation ${conversationId}`);

                // Subscribe to the conversation topic
                client.subscribe(`/topic/conversations/${conversationId}`, (message) => {
                    if (message.body) {
                        const parsedBody = JSON.parse(message.body);
                        onMessageReceived(parsedBody);
                    }
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [conversationId, token]); // Re-connect only if conversationId or token changes

    const sendMessage = useCallback((productId: number, receiverId: number, content: string) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({
                    productId,
                    receiverId,
                    content
                })
            });
            return true;
        }
        return false;
    }, []);

    return { isConnected, sendMessage };
};