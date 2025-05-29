import { Response, NextFunction } from 'express';
import { asyncHandler } from '../Middlewares/errorHandle';
import { AuthenticatedRequest, ApiResponse } from '../types/common.type';
import {
  UpdateUserInput,
  // GetUserByIdInput, // ❌ You don’t need this if you're using `req.params.id`
  // SearchUsersInput, // ❌ Same as above
  // DeleteUserInput // ❌ Same as above
} from '../schemas/user.schema';
import { UserService } from '../services/userservice';

const userService = new UserService();

export const getAllUsers = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const users = await userService.getAll();
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'Users  successfully',
    data: { users },
  });
});

export const search = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const users = await userService.searchByName(req.query.name as string);
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'Search completed successfully',
    data: { users, count: users.length },
  });
});

export const getById = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const user = await userService.getById(req.params.id);
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: { user },
  });
});

export const updateUser = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const user = await userService.update(req.params.id, req.body);
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

export const deleteUser = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  await userService.delete(req.params.id);
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
  });
});
