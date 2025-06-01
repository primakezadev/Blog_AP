import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { sendEmail } from '../Utils/sendemail';
import { ApiResponse } from '../types/common.type';
import { ConflictError, UnauthorizedError } from '../Utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface RegisterDTO {
  name:string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  // Register user and send verification email
  async register(data: RegisterDTO): Promise<ApiResponse> {
    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new ConflictError('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User();
    user.name=data.name;
    user.email = data.email;
    user.password = hashedPassword;
    user.isVerified = false;
    await user.save();

    const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

    await sendEmail(
      user.email,
      'Verify your email',
      `Please click the link below to verify your email:${verificationLink}`
    );

    return {
      statusCode: 201,
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.'
    } satisfies ApiResponse;
  }

  // Email verification
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await User.findOneBy({ id: decoded.userId });

      if (!user) {
        return {
          statusCode: 404,
          success: false,
          message: 'User not found'
        } satisfies ApiResponse;
      }

      if (user.isVerified) {
        return {
          statusCode: 200,
          success: true,
          message: 'Email is already verified'
        } satisfies ApiResponse;
      }

      user.isVerified = true;
      await user.save();

      return {
        statusCode: 200,
        success: true,
        message: 'Email verified successfully'
      } satisfies ApiResponse;
    } catch (err) {
      return {
        statusCode: 400,
        success: false,
        message: 'Invalid or expired verification token'
      } satisfies ApiResponse;
    }
  }

  // User login
  async login(data: LoginDTO): Promise<ApiResponse> {
    const user = await User.findOneBy({ email: data.email });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isVerified) {
      return {
        statusCode: 403,
        success: false,
        message: 'Please verify your email before logging in'
      } satisfies ApiResponse;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: { token }
    } satisfies ApiResponse;
  }

  // Optional: helper to generate any token
  generateToken(user: { id: number; username?: string; email: string }) {
    return jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}
