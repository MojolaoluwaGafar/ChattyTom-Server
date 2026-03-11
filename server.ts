/// <reference path="./types/express/index.d.ts" />

import { Server, Socket} from "socket.io";
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

io.on("connection",(socket : Socket)=>{
  registerChatHandlers(socket);
})

server.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
export { io };
