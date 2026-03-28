/// <reference path="./types/express/index.d.ts" />

import { Server, Socket } from "socket.io";
import http from "http";
import { app } from "./index";
import { registerChatHandlers } from "./Sockets/chatSocket";
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const onlineUsers = new Map<number, Set<string>>();

io.on("connection", (socket: Socket) => {
  const userId = Number(socket.handshake.auth.userId);

  if (!userId) return;

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    io.emit("user_online", userId);
  }

  onlineUsers.get(userId)?.add(socket.id);
  console.log(`User ${userId} connected with socket ${socket.id}`);

  socket.emit("online_users", Array.from(onlineUsers.keys()));

  registerChatHandlers(socket);

  socket.on("disconnect", ()=>{
   const userSockets = onlineUsers.get(userId);

    if (!userSockets) return;

    userSockets.delete(socket.id);

    if (userSockets.size === 0) {
      onlineUsers.delete(userId);
      console.log(`User ${userId} went offline`);
    io.emit("user_offline", Number(userId))
    }
  })
})

server.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
});
export { io };
