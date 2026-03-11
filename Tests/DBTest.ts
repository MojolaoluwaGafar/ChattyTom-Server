import { createUser } from "../Models/UserModel";
import { createConversation } from "../Models/ConversationModel";
import { addParticipant } from "../Models/ConversationParticipantsModel";
import { createMessage } from "../Models/MessageModel";

const runTest = async () => {
  try {
    console.log("🔹 Creating users...");
    
    const user1 = await createUser(
      "john@test.com",
      "John",
      "Doe",
      "password123"
    );

    const user2 = await createUser(
      "jane@test.com",
      "Jane",
      "Smith",
      "password123"
    );

    console.log("Users created:", user1.id, user2.id);

    console.log("🔹 Creating conversation...");
    
    const conversation = await createConversation(false);

    console.log("Conversation created:", conversation.id);

    console.log("🔹 Adding participants...");

    await addParticipant(conversation.id, user1.id);
    await addParticipant(conversation.id, user2.id);

    console.log("Participants added");

    console.log("🔹 Creating message...");

    const message = await createMessage(
      conversation.id,
      user1.id,
      "Hello Jane 👋"
    );

    console.log("Message created:", message);

    console.log("✅ DB TEST SUCCESSFUL");
  } catch (error) {
    console.error("❌ DB TEST FAILED:", error);
  }
};

runTest();