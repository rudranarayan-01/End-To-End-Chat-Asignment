import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Send, UserCircle2, Shield } from 'lucide-react';
import { api } from '@/services/api';
import Sidebar from '@/components/SideBar';
import { io } from 'socket.io-client';

// Initialize Socket.IO client
const socket = io('http://127.0.0.1:5000' || 'https://end-to-end-chat-backend.onrender.com');

export default function ChatPage() {
    const { userId } = useParams(); 
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [chattingWith, setChattingWith] = useState<any>(null); // To store the partner's username
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Initial Setup: Load Current User & Partner Info
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            
            // Fetch partner details to show username in header
            fetchPartnerDetails();
            // Fetch initial chat history
            fetchMessages(user.id);
        } else {
            navigate('/');
        }
    }, [userId]);

    // 2. Real-time Listening: Handle incoming messages via WebSockets
    useEffect(() => {
        socket.on('receive_message', (newMsg) => {
            // Verify if the message belongs to this current open chat
            const isRelevant = 
                (newMsg.sender_id === currentUser?.id && newMsg.receiver_id === parseInt(userId!)) ||
                (newMsg.sender_id === parseInt(userId!) && newMsg.receiver_id === currentUser?.id);

            if (isRelevant) {
                setChatHistory((prev) => [...prev, newMsg]);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, [userId, currentUser]);

    // 3. Auto-scroll to latest message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const fetchPartnerDetails = async () => {
        try {
            // This calls the GET /users/<id> route in Flask
            const response = await api.get(`/users/${userId}`);
            setChattingWith(response.data);
        } catch (error) {
            console.error("Could not fetch user details", error);
            setChattingWith({ username: `User ${userId}` });
        }
    };

    const fetchMessages = async (myId: number) => {
        try {
            const response = await api.get(`/messages/${myId}/${userId}`);
            setChatHistory(response.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currentUser) return;

        const payload = {
            sender_id: currentUser.id,
            receiver_id: parseInt(userId!),
            content: message,
            timestamp: new Date().toISOString()
        };

        // Emit through WebSocket for real-time delivery
        socket.emit('send_message', payload);
        setMessage('');
    };

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
            {/* Sidebar - Desktop Only */}
            <div className="hidden md:block shrink-0 border-r">
                <Sidebar />
            </div>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 min-w-0">
                
                {/* Header with Dynamic Username */}
                <header className="h-16 border-b bg-white/95 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/dashboard')}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                <UserCircle2 className="w-7 h-7 text-indigo-600" />
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-sm md:text-base leading-none">
                                {chattingWith ? chattingWith.username : 'Loading...'}
                            </h2>
                            <div className="flex items-center gap-1 mt-1">
                                <Shield className="w-3 h-3 text-green-600" />
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure Channel</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Message Display Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 chat-bg-pattern bg-slate-50/50">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[65%] p-4 rounded-2xl shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${
                                msg.sender_id === currentUser?.id 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}>
                                <p className="text-[14px] leading-relaxed wrap-break-word">{msg.content}</p>
                                <span className={`text-[9px] mt-2 block font-medium opacity-70 ${msg.sender_id === currentUser?.id ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} /> 
                </div>

                {/* Footer Input Area */}
                <footer className="p-4 bg-white border-t border-slate-100 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                        <Input
                            placeholder="Type a message..."
                            className="border-none bg-transparent shadow-none focus-visible:ring-0 h-10 text-sm"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            disabled={!message.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-10 font-semibold transition-all shadow-md shadow-indigo-200 active:scale-95"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Send</span>
                        </Button>
                    </form>
                </footer>
            </main>
        </div>
    );
}
