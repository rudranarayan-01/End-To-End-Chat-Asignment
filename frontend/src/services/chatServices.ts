import type { Message, User } from '@/types/chat';
import { io, Socket } from 'socket.io-client';

class ChatService {
    private socket: Socket | null = null;
    private callbacks: any = {};

    connect(userId: string) {
        this.socket = io('http://localhost:5000');

        this.socket.on('connect', () => {
            this.socket?.emit('register', { userId });
        });

        // Listen for all online users
        this.socket.on('online_users', (users: User[]) => {
            this.callbacks.onUsersChange?.(users);
        });

        // Private message handler
        this.socket.on('private_message', (message: Message) => {
            this.callbacks.onMessage?.(message);
        });

        // User typing status
        this.socket.on('typing', (data: { from: string; room: string; typing: boolean }) => {
            this.callbacks.onTyping?.(data);
        });

        return this.socket;
    }

    joinPrivateChat(targetUserId: string, currentUserId: string) {
        const room = [currentUserId, targetUserId].sort().join('_');
        this.socket?.emit('join_private', { room, targetUserId });
    }

    sendPrivateMessage(targetUserId: string, content: string, currentUserId: string) {
        const room = [currentUserId, targetUserId].sort().join('_');
        this.socket?.emit('private_message', { targetUserId, content, room });
    }

    startTyping(targetUserId: string, currentUserId: string) {
        const room = [currentUserId, targetUserId].sort().join('_');
        this.socket?.emit('typing', { targetUserId, room, typing: true });
    }

    stopTyping(targetUserId: string, currentUserId: string) {
        const room = [currentUserId, targetUserId].sort().join('_');
        this.socket?.emit('typing', { targetUserId, room, typing: false });
    }

    onUsersChange(callback: (users: User[]) => void) {
        this.callbacks.onUsersChange = callback;
    }

    onMessage(callback: (message: Message) => void) {
        this.callbacks.onMessage = callback;
    }

    onTyping(callback: (data: any) => void) {
        this.callbacks.onTyping = callback;
    }

    disconnect() {
        this.socket?.disconnect();
    }
}

export const chatService = new ChatService();
