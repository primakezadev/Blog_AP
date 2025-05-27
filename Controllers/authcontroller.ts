import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface User {
  id: number;
  username: string;
  passwordHash: string;
}

let users: User[] = [];
let userIdCounter = 1;

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password required" });
      
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: userIdCounter++,
      username,
      passwordHash,
    };

    users.push(newUser);
    res.status(201).json({ message: "User registered", user: { id: newUser.id, username: newUser.username } });
  } catch (err: any) {
    console.error('register error:', err);
    if (err.code === '23505') {
      res.status(500).json({ message: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string; password: string } = req.body;

    const user = users.find((u: User) => u.username === username);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
