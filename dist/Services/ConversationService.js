"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationById = exports.getUserConversations = exports.createGroupConversation = exports.createOneToOneConversation = void 0;
const Db_1 = __importDefault(require("../Config/Db"));
const ConversationModel_1 = require("../Models/ConversationModel");
const ConversationParticipantsModel_1 = require("../Models/ConversationParticipantsModel");
const MessageService_1 = require("./MessageService");
// Responsibilities:
// Create 1-on-1 conversations and avoid duplicates.
// Create group conversations, ensuring at least 2 members and unique participants.
// Add participants to conversations.
// Fetch all conversations for a user (for the chat list) with the last message preview.
// Fetch a single conversation by ID.
//calls message service when needed
//does not write message sql
// Flow:
// When a new message comes in, the service ensures the conversation exists.
// For group chats, participants are validated before creation.
// 1-on-1 chats automatically check for existing conversations between two users.
//gets convo,gets participant,asks messageservice for messages,combines result
//create1-1Convo
const createOneToOneConversation = async (user1Id, user2Id) => {
    if (user1Id === user2Id) {
        throw new Error("Cannot create conversation with yourself");
    }
    // 1. Check if conversation already exists between both users
    const existingConvo = await Db_1.default.query(`SELECT C.* FROM conversations c 
        JOIN conversation_participants cp1 ON cp1.conversation_id = c.id
        JOIN conversation_participants cp2 ON cp2.conversation_id = c.id
        WHERE c.is_group = false
        AND cp1.user_id = $1
        AND cp2.user_id = $2`, [user1Id, user2Id]);
    // 2. If yes → return it
    if (existingConvo.rows.length > 0) {
        return existingConvo.rows[0];
    }
    // 3. If no → create conversation
    const conversation = await (0, ConversationModel_1.createConversation)(false);
    // 4. Add both participants
    await (0, ConversationParticipantsModel_1.addParticipant)(conversation.id, user1Id);
    await (0, ConversationParticipantsModel_1.addParticipant)(conversation.id, user2Id);
    return conversation;
};
exports.createOneToOneConversation = createOneToOneConversation;
//createGroupConversation
const createGroupConversation = async (name, creatorId, membersIds) => {
    if (!name) {
        throw new Error("Group name is required");
    }
    //remove duplicate members
    const uniqueMembers = Array.from(new Set(membersIds));
    //Ensure creator is included
    if (!uniqueMembers.includes(creatorId)) {
        uniqueMembers.push(creatorId);
    }
    if (uniqueMembers.length < 2) {
        throw new Error("Group chat must have at least 2 members");
    }
    const conversation = await (0, ConversationModel_1.createConversation)(true, name);
    for (const userId of uniqueMembers) {
        await (0, ConversationParticipantsModel_1.addParticipant)(conversation.id, userId);
    }
    return conversation;
};
exports.createGroupConversation = createGroupConversation;
//get user conversations for chatList
const getUserConversations = async (userId) => {
    const result = await Db_1.default.query(`
        SELECT c.id, c.is_group, c.updated_at,
        CASE 
        WHEN c.is_group = true THEN c.name
        ELSE CONCAT(u.firstname, ' ', u.lastname)
        END as display_name,
        (SELECT content FROM messages WHERE conversation_id = c.id
        ORDER BY created_at DESC LIMIT 1) as last_message
        FROM conversations c 
        JOIN conversation_participants cp ON cp.conversation_id = c.id
        LEFT JOIN conversation_participants cp_other ON cp_other.conversation_id = c.id
        AND cp_other.user_id != $1
        LEFT JOIN users u ON u.id = cp_other.user_id
        WHERE cp.user_id = $1
        GROUP BY c.id, c.is_group, c.updated_at, display_name
        ORDER BY c.updated_at DESC
        `, [userId]);
    return result.rows;
};
exports.getUserConversations = getUserConversations;
//get a single conversation
const getConversationById = async (conversationId) => {
    const conversation = await (0, ConversationModel_1.findConversationById)(conversationId);
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    const participants = await (0, ConversationParticipantsModel_1.getParticipantsByConversationId)(conversationId);
    const messages = await (0, MessageService_1.getMessagesByConversation)(conversationId);
    return {
        ...conversation,
        participants,
        messages,
    };
};
exports.getConversationById = getConversationById;
