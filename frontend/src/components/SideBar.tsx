import { useState, useEffect } from 'react';
import { Search, UserCircle2, LogOut } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/services/api';

export default function Sidebar() {
    const navigate = useNavigate();
    const { userId: activeUserId } = useParams();
    const [users, setUsers] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            fetchUsers(parsedUser.id);
        } else {
            navigate('/');
        }
    }, []);

    const fetchUsers = async (currentUserId: number) => {
        try {
            const response = await api.get('/users');
            const otherUsers = response.data.filter((u: any) => u.id !== currentUserId);
            setUsers(otherUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className="w-87.5 min-w-87.5 h-full flex flex-col bg-slate-50/50 shrink-0">
            <div className="p-6 pb-2 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                        {currentUser?.username}
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-red-50 hover:text-red-500">
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>

            <div className="px-6 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input className="pl-10 bg-slate-100/50 border-none rounded-xl" placeholder="Search users..." />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => navigate(`/chat/${user.id}`)}
                        className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${activeUserId === String(user.id)
                                ? 'bg-white shadow-sm border-slate-100'
                                : 'border-transparent hover:bg-white/50'
                            }`}
                    >
                        <div className="w-11 h-11 rounded-full bg-indigo-100 shrink-0 flex items-center justify-center">
                            <UserCircle2 className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-900 truncate text-sm">{user.username}</span>
                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Online</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">Click to chat</p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}