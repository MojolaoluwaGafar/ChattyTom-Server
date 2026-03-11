import pool from "../Config/Db"

//conversation interface
export interface IConversation {
  id: string;
  name?: string;
  is_group: boolean;
  created_at: string;
  updated_at: string;
}

export const createConversation = async (
  isGroup: boolean = false,
  name?: string
): Promise<IConversation> => {
  const res = await pool.query(
    `INSERT INTO conversations (is_group, name)
     VALUES ($1, $2)
     RETURNING *`,
    [isGroup, name || null]
  );

  return res.rows[0];
};

export const findConversationById = async (
  id: string
): Promise<IConversation | null> => {
    const res = await pool.query(
    "SELECT * FROM conversations WHERE id = $1",
    [id]);

  return res.rows[0] || null;
};
