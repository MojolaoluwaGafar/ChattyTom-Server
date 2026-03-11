import { Socket } from "socket.io";
import { SendMessage } from "../Services/MessageService";

export function registerChatHandlers(socket: Socket) {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User joined conversation ${conversationId}`);
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

      socket.to(conversationId).emit("receive_message", newMessage);
      socket.emit("receive_message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}