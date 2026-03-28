import { Socket } from "socket.io";
import { SendMessage, markConversationAsRead } from "../Services/MessageService";

export function registerChatHandlers(socket: Socket) {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId: string) => {
   if (!socket.rooms.has(conversationId)) {
    socket.join(conversationId);
    console.log(`User joined conversation ${conversationId}`);
   }
  });

  socket.on("typing_start", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("user_typing", { conversationId, userId });
    console.log("user is typing");
    
  });

  socket.on("typing_stop", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("user_stop_typing", { conversationId,userId });
    console.log("user stopped typing");
    
  });

  socket.on("send_message", async (data: {
    conversationId: string;
    senderId: number;
    content: string;
  }) => {
    try {
      const { conversationId, senderId, content } = data;
      if (!conversationId || !senderId || !content) return;

      const newMessage = await SendMessage(conversationId, senderId, content);

      socket.broadcast.to(conversationId).emit("receive_message", newMessage);
      socket.emit("receive_message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`User left conversation ${conversationId}`);
  });

  socket.on("mark_read", async ({conversationId, userId})=>{
    await markConversationAsRead(conversationId,userId)
    socket.to(conversationId).emit("message_read", {conversationId, userId})
    console.log(`conversation ${conversationId} read`);
    
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}