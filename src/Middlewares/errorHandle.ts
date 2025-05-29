import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../Utils/errors';
import { ApiResponse } from '../types/common.type';
import { promise } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success: false,
      message: error.message,
      errors: error.errors
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success: false,
      message: error.message
    });
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      statusCode: 401,
      success: false,
      message: 'Invalid token'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      statusCode: 401,
      success: false,
      message: 'Token expired'
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message
  });
};


export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}
