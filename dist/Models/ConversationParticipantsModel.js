"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipant = exports.getParticipantsByConversationId = exports.addParticipant = void 0;
const Db_1 = __importDefault(require("../Config/Db"));
//addParticpant
const addParticipant = async (conversationId, userId) => {
    const res = await Db_1.default.query(`INSERT INTO conversation_participants 
     (conversation_id, user_id)
     VALUES ($1, $2)
     RETURNING *`, [conversationId, userId]);
    return res.rows[0];
};
exports.addParticipant = addParticipant;
//getParticpantByConvoId for display
const getParticipantsByConversationId = async (conversationId) => {
    const res = await Db_1.default.query(`SELECT u.id, u.firstname, u.lastname, u.email 
     FROM conversation_participants cp
     JOIN users u ON cp.user_id = u.id 
     WHERE cp.conversation_id = $1`, [conversationId]);
    return res.rows;
};
exports.getParticipantsByConversationId = getParticipantsByConversationId;
//getParticpants for validation
const getParticipant = async (conversationId, userId) => {
    const res = await Db_1.default.query(`SELECT * FROM conversation_participants 
     WHERE conversation_id = $1 AND user_id = $2`, [conversationId, userId]);
    return res.rows[0] || null;
};
exports.getParticipant = getParticipant;
