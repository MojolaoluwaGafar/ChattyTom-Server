import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, IUser } from "../Models/UserModel";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<IUser> => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await createUser(email, firstName, lastName, password);
  return user;
};


export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};

export const verifyToken = (token: string): { userId: number } => {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
};