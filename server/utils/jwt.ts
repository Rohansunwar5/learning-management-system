require("dotenv").config();
import { Response } from 'express';
import { IUser } from '../models/user.model';
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | undefined;
  secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  try {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session to Redis
    // After a successful login, add the user session to the Redis database
    redis.set(user._id, JSON.stringify(user) as any);

    // Parse environment variables to integrate with fallback values
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

    // Options for cookies
    const accessTokenOptions: ITokenOptions = {
      expires: new Date(Date.now() + accessTokenExpire * 1000),
      maxAge: accessTokenExpire * 1000,
      httpOnly: true,
      sameSite: 'lax',
    };

    const refreshTokenOptions: ITokenOptions = {
      expires: new Date(Date.now() + refreshTokenExpire * 1000),
      maxAge: refreshTokenExpire * 1000,
      httpOnly: true,
      sameSite: 'lax',
    };

    // Only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
      accessTokenOptions.secure = true;
      refreshTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    console.error('Error sending token:', error);
    throw new Error('Failed to send token');
  }
};
