import { createUser } from "../Models/UserModel";
import { createConversation } from "../Models/ConversationModel";
import { addParticipant } from "../Models/ConversationParticipantsModel";
import { createMessage } from "../Models/MessageModel";

const runGroupTest = async () => {
  try {
    console.log("🔹 Creating users...");

    const u1 = await createUser(`u1${Date.now()}@test.com`, "Tom", "One", "pass");
    const u2 = await createUser(`u2${Date.now()}@test.com`, "Tom", "Two", "pass");
    const u3 = await createUser(`u3${Date.now()}@test.com`, "Tom", "Three", "pass");
    const u4 = await createUser(`u4${Date.now()}@test.com`, "Tom", "Four", "pass");

    console.log("Users:", u1.id, u2.id, u3.id, u4.id);

    console.log("🔹 Creating group conversation...");

    const group = await createConversation(true, "Weekend Squad");

    console.log("Group created:", group.id);

    console.log("🔹 Adding participants...");

    await addParticipant(group.id, u1.id);
    await addParticipant(group.id, u2.id);
    await addParticipant(group.id, u3.id);
    await addParticipant(group.id, u4.id);

    console.log("Participants added");

    console.log("🔹 Sending messages...");

    await createMessage(group.id, u1.id, "Yo everyone 👋");
    await createMessage(group.id, u2.id, "What’s the plan?");
    await createMessage(group.id, u3.id, "Beach?");
    await createMessage(group.id, u4.id, "I’m in.");

    console.log("Messages sent");

    console.log("✅ GROUP FLOW SUCCESSFUL");
  } catch (err) {
    console.error("❌ GROUP FLOW FAILED:", err);
  }
};

runGroupTest();