import React from 'react';
import { Badge } from './ui/badge';
import { Users } from 'lucide-react';
import { Button } from './ui/button';

const ROOMS = ['general', 'coding', 'chill', 'random', 'music', 'games'];

interface RoomListProps {
    currentRoom: string;
    onRoomChange: (room: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ currentRoom, onRoomChange }) => {
    return (
        <div className="w-80 bg-white/70 backdrop-blur-md border-r border-gray-200 p-8 h-full flex flex-col">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Rooms</h3>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {ROOMS.map((room) => (
                    <Button
                        key={room}
                        variant={currentRoom === room ? "default" : "ghost"}
                        className="w-full h-16 justify-start text-left shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={() => onRoomChange(room)}
                    >
                        <Badge className="mr-3 h-6 font-mono text-xs bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                            {room}
                        </Badge>
                        <span className="font-medium">Join {room}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};
