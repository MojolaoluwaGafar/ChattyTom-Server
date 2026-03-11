import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Services/AuthService";

interface AuthRequest extends Request {
  userId?: number;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verifyToken(token)
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
