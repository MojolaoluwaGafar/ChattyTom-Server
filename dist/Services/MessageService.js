"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markConversationAsRead = exports.getMessagesWithParticipants = exports.getMessagesByConversation = exports.SendMessage = void 0;
const MessageModel_1 = require("../Models/MessageModel");
const ConversationModel_1 = require("../Models/ConversationModel");
const ConversationParticipantsModel_1 = require("./../Models/ConversationParticipantsModel");
const Db_1 = __importDefault(require("../Config/Db"));
//Responsibilities:
// Send a message in a conversation and validate the sender is a participant.
// Retrieve messages for a conversation.
// Retrieve messages along with all participants (important for group chats).
// Mark a conversation as read for a specific participant.
// Flow:
// Before sending a message, the service confirms that the conversation exists and the sender is part of it.
// Messages are stored in the messages table, and the updated_at timestamp of the conversation is updated.
// Messages can be fetched with sender info or with the participant list for UI rendering.
// Read receipts are handled per participant.
//OWNS ALL MESSAGE QUERIES
//send a message in a conversation (uses get particpant)
const SendMessage = async (conversationId, senderId, content) => {
    //check if convo exists
    const convoIdStr = conversationId.toString();
    const conversation = await (0, ConversationModel_1.findConversationById)(convoIdStr);
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    //get and validate sender is a cp
    const isParticipant = await (0, ConversationParticipantsModel_1.getParticipant)(convoIdStr, senderId);
    if (!isParticipant) {
        throw new Error("User is not a participant of this conversation");
    }
    //create message in db
    const message = await (0, MessageModel_1.createMessage)(convoIdStr, senderId, content);
    return message;
};
exports.SendMessage = SendMessage;
//getMessages for a conversation
const getMessagesByConversation = async (conversationId) => {
    const convoIdStr = conversationId.toString();
    const response = await Db_1.default.query(` SELECT m.*, u.firstname, u.lastname, u.email
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC`, [convoIdStr]);
    return response.rows;
};
exports.getMessagesByConversation = getMessagesByConversation;
//get messages with participants (useful for group chats)
const getMessagesWithParticipants = async (conversationId) => {
    const convoIdStr = conversationId.toString();
    const messageResponse = await Db_1.default.query(`
        SELECT m.id, m.content, m.created_at, u.id AS sender_id, u.firstname, u.lastname
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC`, [convoIdStr]);
    const participants = await (0, ConversationParticipantsModel_1.getParticipantsByConversationId)(convoIdStr);
    return {
        messages: messageResponse.rows,
        participants,
    };
};
exports.getMessagesWithParticipants = getMessagesWithParticipants;
//mark all messages in a convo as read by a specific user
const markConversationAsRead = async (conversationId, userId) => {
    const convoIdStr = conversationId.toString();
    await Db_1.default.query(`
        UPDATE conversation_participants
        SET last_read_at = NOW()
        WHERE conversation_id =$1 AND user_id = $2`, [convoIdStr, userId]);
};
exports.markConversationAsRead = markConversationAsRead;
