import { Search, Plus, UserCircle2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

// This layout is the "shell" for both Dashboard and Chat
export default function DashboardShell({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-95 h-full flex flex-col border-r bg-slate-50/30">
        <div className="p-6 pb-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-100">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input className="pl-10 bg-slate-100 border-none rounded-xl" placeholder="Search chats..." />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} onClick={() => navigate(`/chat/${i}`)} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm cursor-pointer transition-all mb-1 border border-transparent hover:border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 shrink-0 flex items-center justify-center">
                <UserCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Coding Group</span>
                  <span className="text-xs text-slate-400">2m ago</span>
                </div>
                <p className="text-sm text-slate-500 truncate">How is the Flask backend coming along?</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <main className="flex-1 h-full bg-slate-50 flex flex-col relative">
        {children || (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-200 rounded-full mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-800">Select a Conversation</h2>
            <p className="text-slate-500 max-w-xs">Pick a user from the left to start a professional end-to-end encrypted chat.</p>
          </div>
        )}
      </main>
    </div>
  );
}