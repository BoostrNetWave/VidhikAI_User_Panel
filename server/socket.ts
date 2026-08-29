import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

// Keep track of user sockets: { userId: socketId }
const userSockets = new Map<string, string>();

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: true, // Allow any origin dynamically
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('register', (userId: string) => {
            if (userId) {
                userSockets.set(userId, socket.id);
                console.log(`User ${userId} registered to socket ${socket.id}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // Remove user from map
            for (const [userId, sockId] of userSockets.entries()) {
                if (sockId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
    const socketId = userSockets.get(userId);
    if (socketId && io) {
        io.to(socketId).emit(event, data);
    }
};
