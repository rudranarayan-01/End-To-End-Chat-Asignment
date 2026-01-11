export interface User {
    id: string;
    username: string;
    isOnline: boolean;
    avatar?: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
}