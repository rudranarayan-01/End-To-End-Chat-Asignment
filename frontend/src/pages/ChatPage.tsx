import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Send, UserCircle2, Shield} from 'lucide-react';
import DashboardShell from './Dashboard'; 
import { api } from '@/services/api';
import Sidebar from '@/components/SideBar';

export default function ChatPage() {
    const { userId } = useParams(); 
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Get current user session and load messages
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            fetchMessages(user.id);
        } else {
            navigate('/');
        }
    }, [userId]); // Reload when switching users

    // 2. Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const fetchMessages = async (myId: number) => {
        try {
            const response = await api.get(`/messages/${myId}/${userId}`);
            setChatHistory(response.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const payload = {
                sender_id: currentUser.id,
                receiver_id: parseInt(userId!),
                content: message
            };
            const response = await api.post('/messages', payload);
            
            // Update local UI immediately
            setChatHistory([...chatHistory, response.data]);
            setMessage('');
        } catch (error) {
            alert("Failed to send message");
        }
    };

    return (
        <div className="flex h-full w-full bg-white overflow-hidden">
            <div className="hidden md:block w-95 border-r">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
                {/* Header */}
                <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/dashboard')}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <UserCircle2 className="w-8 h-8 text-indigo-600" />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-sm md:text-base leading-none">User {userId}</h2>
                            <div className="flex items-center gap-1 mt-1">
                                <Shield className="w-3 h-3 text-green-600" />
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Secure Channel</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 chat-bg-pattern">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-sm ${
                                msg.sender_id === currentUser?.id 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <span className={`text-[9px] mt-2 block opacity-70 ${msg.sender_id === currentUser?.id ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} /> 
                </div>

                {/* Footer */}
                <footer className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 focus-within:bg-white transition-all">
                        <Input
                            placeholder="Type your message..."
                            className="border-none bg-transparent focus-visible:ring-0 h-10 text-sm"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            disabled={!message.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 h-10"
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