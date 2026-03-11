import { Request, Response } from "express";
import { registerUser, loginUser } from "../Services/AuthService";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const user = await registerUser(email, firstName, lastName, password);

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      created_at: user.created_at,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const response = await loginUser(email, password);

    res.json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};