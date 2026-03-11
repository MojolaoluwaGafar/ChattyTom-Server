"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Db_1 = __importDefault(require("../Config/Db"));
const UserModel_1 = require("../Models/UserModel");
const ConversationService_1 = require("../Services/ConversationService");
const MessageService_1 = require("../Services/MessageService");
const runTest = async () => {
    try {
        console.log("🔹 Creating users...");
        const userA = await (0, UserModel_1.createUser)("alice@test.com", "Alice", "Smith", "password123");
        const userB = await (0, UserModel_1.createUser)("bob@test.com", "Bob", "Johnson", "password123");
        const userC = await (0, UserModel_1.createUser)("carol@test.com", "Carol", "Williams", "password123");
        console.log("Users created:", userA.id, userB.id, userC.id);
        console.log("🔹 Creating 1-on-1 conversation...");
        const oneToOneConvo = await (0, ConversationService_1.createOneToOneConversation)(userA.id, userB.id);
        console.log("1-on-1 Conversation ID:", oneToOneConvo.id);
        console.log("🔹 Sending messages in 1-on-1...");
        await (0, MessageService_1.SendMessage)(oneToOneConvo.id, userA.id, "Hey Bob 👋");
        await (0, MessageService_1.SendMessage)(oneToOneConvo.id, userB.id, "Hey Alice! How's it going?");
        console.log("🔹 Fetching 1-on-1 messages...");
        const oneToOneMessages = await (0, MessageService_1.getMessagesWithParticipants)(oneToOneConvo.id);
        console.log(oneToOneMessages);
        console.log("🔹 Creating group conversation...");
        const groupConvo = await (0, ConversationService_1.createGroupConversation)("Weekend Squad", userA.id, [userB.id, userC.id]);
        console.log("Group Conversation ID:", groupConvo.id);
        console.log("🔹 Sending messages in group...");
        await (0, MessageService_1.SendMessage)(groupConvo.id, userA.id, "Welcome to the group!");
        await (0, MessageService_1.SendMessage)(groupConvo.id, userB.id, "Thanks! Excited to be here!");
        await (0, MessageService_1.SendMessage)(groupConvo.id, userC.id, "Let's do this 💪");
        console.log("🔹 Fetching group messages with participants...");
        const groupMessages = await (0, MessageService_1.getMessagesWithParticipants)(groupConvo.id);
        console.log(groupMessages);
        console.log("🔹 Marking group as read for Alice...");
        await (0, MessageService_1.markConversationAsRead)(groupConvo.id, userA.id);
        console.log("✅ Group conversation marked as read for Alice");
        console.log("🔹 Fetching all conversations for Bob...");
        const bobConvos = await (0, ConversationService_1.getUserConversations)(userB.id);
        console.log(bobConvos);
        console.log("🎉 DB CONVERSATION FLOW TEST SUCCESSFUL!");
    }
    catch (error) {
        console.error("❌ DB TEST FAILED:", error.message);
    }
    finally {
        await Db_1.default.end();
    }
};
runTest();
