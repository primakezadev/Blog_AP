import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { asyncHandler } from '../Middlewares/errorHandle';

// JWT secret fallback
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Extended Request interface that includes a user object
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
  };
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = asyncHandler(async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      success: false,
      message: 'Access token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email?: string };
    const user = await User.findOneBy({ id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'User not found',
      });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(403).json({
      statusCode: 403,
      success: false,
      message: 'Invalid or expired token',
    });
  }
});

/**
 * Email verification endpoint (optional, can be placed in controller instead)
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: 'Token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await User.findOneBy({ id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'User not found',
      });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: 'Invalid or expired token',
    });
  }
});
