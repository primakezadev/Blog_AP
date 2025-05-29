import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError, UnauthorizedError } from '../Utils/errors';
import { ApiResponse } from '../types/common.type';

const users: any[] = [];
let userId = 1;

export class AuthService {
  async register({ username, email, password }: any): Promise<ApiResponse> {
    const exists = users.find(u => u.username === username || u.email === email);
    if (exists) throw new ConflictError('Username or email already taken');

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { id: userId++, username, email, passwordHash };
    users.push(newUser);

    const token = this.generateToken(newUser);

    return {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        },
        token
      }
    };
  }

  async login({ username, password }: any): Promise<ApiResponse> {
    const user = users.find(u => u.username === username);
    if (!user) throw new UnauthorizedError('Invalid username or password');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedError('Invalid username or password');

    const token = this.generateToken(user);

    return {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    };
  }

  generateToken(user: { id: number, username: string, email: string }) {
    return jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  }
}
