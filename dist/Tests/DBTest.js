"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../Models/UserModel");
const ConversationModel_1 = require("../Models/ConversationModel");
const ConversationParticipantsModel_1 = require("../Models/ConversationParticipantsModel");
const MessageModel_1 = require("../Models/MessageModel");
const runTest = async () => {
    try {
        console.log("🔹 Creating users...");
        const user1 = await (0, UserModel_1.createUser)("john@test.com", "John", "Doe", "password123");
        const user2 = await (0, UserModel_1.createUser)("jane@test.com", "Jane", "Smith", "password123");
        console.log("Users created:", user1.id, user2.id);
        console.log("🔹 Creating conversation...");
        const conversation = await (0, ConversationModel_1.createConversation)(false);
        console.log("Conversation created:", conversation.id);
        console.log("🔹 Adding participants...");
        await (0, ConversationParticipantsModel_1.addParticipant)(conversation.id, user1.id);
        await (0, ConversationParticipantsModel_1.addParticipant)(conversation.id, user2.id);
        console.log("Participants added");
        console.log("🔹 Creating message...");
        const message = await (0, MessageModel_1.createMessage)(conversation.id, user1.id, "Hello Jane 👋");
        console.log("Message created:", message);
        console.log("✅ DB TEST SUCCESSFUL");
    }
    catch (error) {
        console.error("❌ DB TEST FAILED:", error);
    }
};
runTest();
