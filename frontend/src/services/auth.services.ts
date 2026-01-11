export const authService = {
    login: async (username: string) => {
        // In real app: await axios.post('/login', { username })
        const mockUser = { id: '1', username, isOnline: true };
        localStorage.setItem('chat_user', JSON.stringify(mockUser));
        return mockUser;
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('chat_user');
        return user ? JSON.parse(user) : null;
    },
    logout: () => localStorage.removeItem('chat_user')
};