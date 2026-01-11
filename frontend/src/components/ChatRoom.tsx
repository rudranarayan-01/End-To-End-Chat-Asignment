// import React, { useRef, useEffect } from 'react';
// import { type Message } from '../types/chat';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { ScrollArea } from './ui/scroll-area';

// interface ChatRoomProps {
//     messages: Message[];
// }

// export const ChatRoom: React.FC<ChatRoomProps> = ({ messages }) => {
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     return (
//         <ScrollArea className="flex-1 rounded-2xl bg-white/50 backdrop-blur-md border border-gray-200 shadow-xl">
//             <div className="p-8 space-y-6 max-w-4xl mx-auto">
//                 {messages.map((msg, idx) => (
//                     <div key={msg.id || idx} className="flex gap-4">
//                         <Avatar className="w-12 h-12 shrink-0">
//                             <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-semibold">
//                                 {msg.sender.slice(0, 2).toUpperCase()}
//                             </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-2">
//                                 <span className="font-bold text-gray-900 text-lg truncate">{msg.sender}</span>
//                                 <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                 </span>
//                             </div>
//                             <p className="text-lg leading-relaxed text-gray-800 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
//                                 {msg.content}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </ScrollArea>
//     );
// };
