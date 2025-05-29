import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      username: string;
    };

    const user = await User.findOneBy({ id: decoded.userId });

    if (!user) {
      res.status(403).json({ message: "User not found for token" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "invalid or expired token" });
  }
};
