"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = void 0;
const Db_1 = __importDefault(require("../Config/Db"));
const createMessage = async (conversationId, senderId, content) => {
    const res = await Db_1.default.query(`INSERT INTO messages (conversation_id, sender_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`, [conversationId, senderId, content]);
    await Db_1.default.query(`UPDATE conversations
     SET updated_at = NOW()
     WHERE id = $1`, [conversationId]);
    return res.rows[0];
};
exports.createMessage = createMessage;
