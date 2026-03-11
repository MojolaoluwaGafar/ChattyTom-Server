import pool from "../Config/Db"


export interface IConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: number;
  joined_at: string;
  last_read_at: string | null;
}

export interface IParticipantDetails {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

//addParticpant
export const addParticipant = async (
  conversationId: string,
  userId: number
): Promise<IConversationParticipant> => {
  const res = await pool.query(
    `INSERT INTO conversation_participants 
     (conversation_id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [conversationId, userId]
  );

  return res.rows[0];
};

//getParticpantByConvoId for display
export const getParticipantsByConversationId = async (
  conversationId: string
): Promise<IParticipantDetails[]> => {
  const res = await pool.query(
    `SELECT u.id, u.firstname, u.lastname, u.email 
     FROM conversation_participants cp
     JOIN users u ON cp.user_id = u.id 
     WHERE cp.conversation_id = $1`,
    [conversationId]
  );

  return res.rows;
};

//getParticpants for validation
export const getParticipant = async (
  conversationId: string,
  userId: number
): Promise<IConversationParticipant | null> => {
  const res = await pool.query(
    `SELECT * FROM conversation_participants 
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );

  return res.rows[0] || null;
}