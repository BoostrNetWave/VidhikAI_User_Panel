import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

// Keep track of user sockets: { userIdKey: Set<socketId> }
const userSockets = new Map<string, Set<string>>();

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: true, // Allow any origin dynamically
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        socket.on('register', (payload: any) => {
            if (!payload) return;
            const idsToRegister: string[] = [];
            if (typeof payload === 'string') {
                idsToRegister.push(payload);
            } else if (typeof payload === 'object') {
                if (payload._id) idsToRegister.push(payload._id.toString());
                if (payload.id) idsToRegister.push(payload.id.toString());
                if (payload.userId) idsToRegister.push(payload.userId.toString());
                if (payload.email) idsToRegister.push(payload.email.toString());
            }

            idsToRegister.forEach(idKey => {
                if (!idKey) return;
                let sockets = userSockets.get(idKey);
                if (!sockets) {
                    sockets = new Set<string>();
                    userSockets.set(idKey, sockets);
                }
                sockets.add(socket.id);
                console.log(`[Socket] User key registered: ${idKey} -> socket ${socket.id}`);
            });
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
            // Remove socket.id from all sets
            for (const [idKey, sockets] of userSockets.entries()) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    userSockets.delete(idKey);
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

export const emitToUser = (userIdOrKeys: string | (string | undefined)[], event: string, data: any) => {
    if (!io) return;
    const keys = Array.isArray(userIdOrKeys) ? userIdOrKeys : [userIdOrKeys];
    const targetSocketIds = new Set<string>();

    keys.forEach(key => {
        if (!key) return;
        const sockets = userSockets.get(key.toString());
        if (sockets) {
            sockets.forEach(sockId => targetSocketIds.add(sockId));
        }
    });

    targetSocketIds.forEach(sockId => {
        io.to(sockId).emit(event, data);
        console.log(`[Socket] Emitted event '${event}' to socket ${sockId}`);
    });
};
