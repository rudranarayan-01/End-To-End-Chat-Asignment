import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft, Send, MoreVertical, Phone, Video,
    UserCircle2, Paperclip, Smile, Shield
} from 'lucide-react';
import Dashboard from './Dashboard';

export default function ChatPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    return (
        <div className="flex h-full w-full bg-white overflow-hidden">
            {/* Sidebar - Desktop Only */}
            <div className="hidden md:block w-95 border-r">
                <Dashboard />
            </div>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">

                {/* Header - Glassmorphism style */}
                <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/dashboard')}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <UserCircle2 className="w-8 h-8 text-indigo-600" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-sm md:text-base leading-none">User {userId}</h2>
                            <div className="flex items-center gap-1 mt-1">
                                <Shield className="w-3 h-3 text-green-600" />
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Secure Channel</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full"><Phone className="w-4 h-4 text-slate-500" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-full"><Video className="w-4 h-4 text-slate-500" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4 text-slate-500" /></Button>
                    </div>
                </header>

                {/* Message Area with Pattern Background */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 chat-bg-pattern">
                    {/* System Message */}
                    <div className="flex justify-center">
                        <p className="bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-500 text-[11px] px-3 py-1 rounded-full shadow-sm">
                            Messages are end-to-end encrypted.
                        </p>
                    </div>

                    {/* Example Received Message */}
                    <div className="flex justify-start">
                        <div className="max-w-[80%] md:max-w-[60%] bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <p className="text-slate-800 text-sm leading-relaxed">
                                Hey! I've set up the React-Vite project with Tailwind. How should we proceed with the Flask integration?
                            </p>
                            <span className="text-[10px] text-slate-400 mt-2 block font-medium">10:42 AM</span>
                        </div>
                    </div>

                    {/* Example Sent Message */}
                    <div className="flex justify-end">
                        <div className="max-w-[80%] md:max-w-[60%] bg-indigo-600 p-4 rounded-2xl rounded-tr-none shadow-md shadow-indigo-200">
                            <p className="text-white text-sm leading-relaxed">
                                That looks great! Let's start by building the SQLite database models first.
                            </p>
                            <span className="text-[10px] text-indigo-200 mt-2 block text-right font-medium font-mono">DELIVERED</span>
                        </div>
                    </div>
                </div>

                {/* Input Footer */}
                <footer className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                    <form className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 shrink-0">
                            <Smile className="w-5 h-5" />
                        </Button>
                        <Input
                            placeholder="Type your message..."
                            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 shrink-0">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <Button
                            type="submit"
                            disabled={!message.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 h-10 transition-all shrink-0"
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