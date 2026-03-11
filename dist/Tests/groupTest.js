"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../Models/UserModel");
const ConversationModel_1 = require("../Models/ConversationModel");
const ConversationParticipantsModel_1 = require("../Models/ConversationParticipantsModel");
const MessageModel_1 = require("../Models/MessageModel");
const runGroupTest = async () => {
    try {
        console.log("🔹 Creating users...");
        const u1 = await (0, UserModel_1.createUser)(`u1${Date.now()}@test.com`, "Tom", "One", "pass");
        const u2 = await (0, UserModel_1.createUser)(`u2${Date.now()}@test.com`, "Tom", "Two", "pass");
        const u3 = await (0, UserModel_1.createUser)(`u3${Date.now()}@test.com`, "Tom", "Three", "pass");
        const u4 = await (0, UserModel_1.createUser)(`u4${Date.now()}@test.com`, "Tom", "Four", "pass");
        console.log("Users:", u1.id, u2.id, u3.id, u4.id);
        console.log("🔹 Creating group conversation...");
        const group = await (0, ConversationModel_1.createConversation)(true, "Weekend Squad");
        console.log("Group created:", group.id);
        console.log("🔹 Adding participants...");
        await (0, ConversationParticipantsModel_1.addParticipant)(group.id, u1.id);
        await (0, ConversationParticipantsModel_1.addParticipant)(group.id, u2.id);
        await (0, ConversationParticipantsModel_1.addParticipant)(group.id, u3.id);
        await (0, ConversationParticipantsModel_1.addParticipant)(group.id, u4.id);
        console.log("Participants added");
        console.log("🔹 Sending messages...");
        await (0, MessageModel_1.createMessage)(group.id, u1.id, "Yo everyone 👋");
        await (0, MessageModel_1.createMessage)(group.id, u2.id, "What’s the plan?");
        await (0, MessageModel_1.createMessage)(group.id, u3.id, "Beach?");
        await (0, MessageModel_1.createMessage)(group.id, u4.id, "I’m in.");
        console.log("Messages sent");
        console.log("✅ GROUP FLOW SUCCESSFUL");
    }
    catch (err) {
        console.error("❌ GROUP FLOW FAILED:", err);
    }
};
runGroupTest();
