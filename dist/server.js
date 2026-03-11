"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
//server for realtime communication
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const index_1 = require("./index");
const MessageService_1 = require("./Services/MessageService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
//creates real http server and let express handle the http routes
const server = http_1.default.createServer(index_1.app);
//attach websocket capability to the same same server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
exports.io = io;
//client connects, gets a unique socketID and put user into a room identified by convoID
//e.g all users in a chat
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation ${conversationId}`);
    });
    //listens for send_message events from client and call sendmessage to save/send message to DB, broadcast new messages to everyone in a convo room using convoId 
    socket.on("send_message", async (data) => {
        try {
            const { conversationId, senderId, content } = data;
            if (!conversationId || !senderId || !content)
                return;
            const newMessage = await (0, MessageService_1.SendMessage)(conversationId, senderId, content);
            //broadcast
            socket.to(conversationId).emit("receive_message", newMessage); //to everyone except sender
            socket.emit("receive_message", newMessage); //to sender
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    });
    //when user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
//start server on port 5000
server.listen(port, () => {
    console.log(`Server running on port ${port} `);
});
