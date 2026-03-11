import pool from "../Config/Db"

export interface IMessage {
  id: string;
  conversation_id: string;
  sender_id: number;
  content: string;
  created_at: string;
}

export const createMessage = async (
  conversationId: string,
  senderId: number | string,
  content: string
): Promise<IMessage> => {
  const res = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, senderId, content]
  );

  await pool.query(
    `UPDATE conversations
     SET updated_at = NOW()
     WHERE id = $1`,
    [conversationId]
  );

  return res.rows[0];
};