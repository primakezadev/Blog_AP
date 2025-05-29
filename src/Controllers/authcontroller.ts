import { Request, Response } from 'express';
import { AuthService } from '../services/authservice';
import { asyncHandler } from '../Middlewares/errorHandle';
import { ApiResponse } from '../types/common.type';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const result = await authService.register(req.body); // handles everything inside
  res.status(result.statusCode).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const result = await authService.login(req.body); // handles everything inside
  res.status(result.statusCode).json(result);
});
 
