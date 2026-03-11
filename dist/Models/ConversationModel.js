"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConversationById = exports.createConversation = void 0;
const Db_1 = __importDefault(require("../Config/Db"));
const createConversation = async (isGroup = false, name) => {
    const res = await Db_1.default.query(`INSERT INTO conversations (is_group, name)
     VALUES ($1, $2)
     RETURNING *`, [isGroup, name || null]);
    return res.rows[0];
};
exports.createConversation = createConversation;
const findConversationById = async (id) => {
    const res = await Db_1.default.query("SELECT * FROM conversations WHERE id = $1", [id]);
    return res.rows[0] || null;
};
exports.findConversationById = findConversationById;
