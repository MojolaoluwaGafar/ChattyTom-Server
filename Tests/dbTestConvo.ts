import pool from "../Config/Db";
import { createUser, IUser } from "../Models/UserModel";
import { createOneToOneConversation, createGroupConversation, getUserConversations } from "../Services/ConversationService";
import { SendMessage, getMessagesWithParticipants, markConversationAsRead } from "../Services/MessageService";

const runTest = async () => {
  try {
    console.log("🔹 Creating users...");
    const userA: IUser = await createUser("alice@test.com", "Alice", "Smith", "password123");
    const userB: IUser = await createUser("bob@test.com", "Bob", "Johnson", "password123");
    const userC: IUser = await createUser("carol@test.com", "Carol", "Williams", "password123");

    console.log("Users created:", userA.id, userB.id, userC.id);

    console.log("🔹 Creating 1-on-1 conversation...");
    const oneToOneConvo = await createOneToOneConversation(userA.id, userB.id);
    console.log("1-on-1 Conversation ID:", oneToOneConvo.id);

    console.log("🔹 Sending messages in 1-on-1...");
    await SendMessage(oneToOneConvo.id, userA.id, "Hey Bob 👋");
    await SendMessage(oneToOneConvo.id, userB.id, "Hey Alice! How's it going?");

    console.log("🔹 Fetching 1-on-1 messages...");
    const oneToOneMessages = await getMessagesWithParticipants(oneToOneConvo.id);
    console.log(oneToOneMessages);

    console.log("🔹 Creating group conversation...");
    const groupConvo = await createGroupConversation("Weekend Squad", userA.id, [userB.id, userC.id]);
    console.log("Group Conversation ID:", groupConvo.id);

    console.log("🔹 Sending messages in group...");
    await SendMessage(groupConvo.id, userA.id, "Welcome to the group!");
    await SendMessage(groupConvo.id, userB.id, "Thanks! Excited to be here!");
    await SendMessage(groupConvo.id, userC.id, "Let's do this 💪");

    console.log("🔹 Fetching group messages with participants...");
    const groupMessages = await getMessagesWithParticipants(groupConvo.id);
    console.log(groupMessages);

    console.log("🔹 Marking group as read for Alice...");
    await markConversationAsRead(groupConvo.id, userA.id);
    console.log("✅ Group conversation marked as read for Alice");

    console.log("🔹 Fetching all conversations for Bob...");
    const bobConvos = await getUserConversations(userB.id);
    console.log(bobConvos);

    console.log("🎉 DB CONVERSATION FLOW TEST SUCCESSFUL!");
  } catch (error: any) {
    console.error("❌ DB TEST FAILED:", error.message);
  } finally {
    await pool.end();
  }
};

runTest();