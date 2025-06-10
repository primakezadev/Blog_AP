import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../services/authservice';
import { asyncHandler } from '../Middlewares/errorHandle';
import { ApiResponse } from '../types/common.type';
import { NotFoundError } from '../Utils/errors';
import { sendResetPasswordEmail } from "../Utils/email";
import { generateResetToken } from "../Utils/jwt";

import { UserService } from '../services/userservice';

const userService = new UserService();
const authService = new AuthService();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
export const register = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const result = await authService.register(req.body);
  res.status(result.statusCode).json(result);
});

// Login
export const login = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const result = await authService.login(req.body);
  res.status(result.statusCode).json(result);
});

// Verify email
export const verifyEmail = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const token = req.query.token as string;
  const result = await authService.verifyEmail(token);
  res.status(result.statusCode).json(result);
});

// Forgot Password
export const forgotPassword = asyncHandler(async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw new NotFoundError('No user found with that email address');
  }

  const token = generateResetToken(user.email);
  const resetLink = `${process.env.RESET_PASSWORD_URL}/${token}`;

  await sendResetPasswordEmail(email, resetLink);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
    statusCode: 200
  });
});

// Reset Password
export const resetPassword = asyncHandler(async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
  const user = await userService.findByEmail(decoded.email);

  if (!user) throw new NotFoundError('User');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
await userService.update(user.id.toString(), { password: hashedPassword });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    statusCode: 200
  });
});
