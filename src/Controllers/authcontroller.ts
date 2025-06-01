import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authservice';
import { asyncHandler } from '../Middlewares/errorHandle';
import { ApiResponse } from '../types/common.type';
import { User } from '../entities/User'; //  Import User entity

const authService = new AuthService();
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; //  Define JWT_SECRET

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


// verify email
export const verifyEmail = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const token = req.query.token as string;
  const result = await authService.verifyEmail(token);
  res.status(result.statusCode).json(result);
});


