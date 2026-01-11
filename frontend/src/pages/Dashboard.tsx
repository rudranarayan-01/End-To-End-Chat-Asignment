import Sidebar from '@/components/SideBar';
import { UserCircle2 } from 'lucide-react';

export default function DashboardShell() {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 h-full bg-white flex flex-col relative">
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
             <div className="w-20 h-20 bg-indigo-50 rounded-full mb-4 flex items-center justify-center">
                <UserCircle2 className="w-12 h-12 text-indigo-200" />
             </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome back!</h2>
            <p className="text-slate-500 max-w-xs mt-2 text-sm leading-relaxed">
              Select a conversation from the left to start messaging.
            </p>
          </div>
      </main>
    </div>
  );
}