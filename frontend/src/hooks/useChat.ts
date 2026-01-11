import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types/chat';
import { Socket } from 'socket.io-client';
import { chatService } from '../services/chatServices';

export const useChat = (room: string, username: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    // @ts-ignore
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = chatService.connect();
        setSocket(newSocket);

        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));

        chatService.onNewMessage((data: Message) => {
            setMessages(prev => [...prev, data]);
        });

        chatService.joinRoom(room, username);

        return () => {
            chatService.disconnect();
        };
    }, [room, username]);

    const sendMessage = useCallback((message: string) => {
        chatService.sendMessage(room, username, message);
    }, [room, username]);

    return { messages, sendMessage, isConnected };
};
