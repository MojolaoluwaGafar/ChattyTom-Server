import pool from "../Config/Db"
import bcrypt from "bcrypt"

//build user interface for user models
export interface IUser {
    id : number,
    email : string,
    firstName : string,
    lastName : string,
    password : string,
    created_at : string
}

//map models to database schema (define schema)
//creating actual tables and migrations
//that correspond to user interface
//this sets the foundation for crud operations

//create a new user in database
export const createUser = async (
    email:string,
    firstName : string,
    lastName : string,
    password : string
) : Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(password, 12);
    //use the connection pool to run a sql query
    const res = await pool.query(
        "INSERT INTO users (email, firstName, lastName, password) VALUES ($1,$2,$3,$4) RETURNING *",
        [email, firstName, lastName, hashedPassword]
    );
    return res.rows[0]
};

//look up user in database
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return res.rows[0] || null;
};

export const findUserById = async (id: number): Promise<IUser | null> => {
  const res = await pool.query(
    "SELECT id, email,firstName, lastName, created_at FROM users WHERE id=$1",
    [id]
  );
  return res.rows[0] || null;
};