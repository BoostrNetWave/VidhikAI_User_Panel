import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5003', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }
    return socket;
};

export const registerSocketUser = (userId: string) => {
    const s = getSocket();
    s.emit('register', userId);
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
