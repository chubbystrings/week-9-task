import { Request, Response } from 'express';
import { UserSchema } from '../models/user';
import {
  validateUserSignup, hashPassword, generateToken, validateUserLoginDetails,
  comparePassword,
} from '../utils/validate';

export async function signup(req:Request, res: Response): Promise<Response | void> {
  try {
    const { error } = validateUserSignup(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
        data: [],
      });
    }

    const hashedPassword = hashPassword(req.body.password);

    const user = new UserSchema({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    const data = await user.save();
    if (!data) {
      return res.status(500).json({
        status: 'error',
        message: 'could not save',
        data: [],
      });
    }

    const token = generateToken(data._id);
    return res.status(201).json({
      status: 'success',
      message: 'successful',
      data,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'could not save',
      data: [],
    });
  }
}

export async function login(req: Request, res: Response): Promise<Response | void> {
  try {
    const { error } = validateUserLoginDetails(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
        data: [],
      });
    }

    const emailExist = await UserSchema.findOne({ email: req.body.email });
    if (!emailExist) {
      return res.status(500).json({
        status: 'error',
        message: 'invalid email or password',
        data: [],
      });
    }

    if (!comparePassword(emailExist.password, req.body.password)) {
      return res.status(500).json({
        status: 'error',
        message: 'invalid email or password',
        data: [],
      });
    }

    req.currentUser = <string>emailExist._id;
    const token = generateToken(emailExist._id);

    return res.status(200).json({
      status: 'success',
      message: 'successful',
      data: emailExist,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An unknown error occurred',
      data: [],
    });
  }
}
