import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserSchema } from '../models/user';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid headers',
        data: [],
      });
    }
    const token: string = req.headers.authorization.split(' ')[1];
    const decodedToken = <any>jwt.verify(token, process.env.JWT_SECRET!);
    if (!decodedToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        data: [],
      });
    }

    const { userID } = decodedToken;
    const data = await UserSchema.findById(userID);

    if (!data) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        data: [],
      });
    }

    req.currentUser = <string>decodedToken.userID;

    return next();
  } catch (error) {
    if (error.message && error.message.includes('jwt')) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        data: [],
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'An unknown error occurred',
      data: [],
    });
  }
}
