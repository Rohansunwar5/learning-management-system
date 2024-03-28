import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { IUser } from "../models/user.model";

// interface AuthenticatedRequest extends Request {
//   user?: IUser;
// }
// authenticated user  middleware to check if a token is provided in the header and verify it. 
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.cookies);
  const access_token = req.cookies.access_token as string;
  
  // console.log(access_token);
  
  if(!access_token){
    return next(new ErrorHandler("please login to access this resource ", 401))
  }

  const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload;

  if(!decoded){
    return next(new ErrorHandler("Invalid token", 401)) 
  }

  const user = await redis.get(decoded.id);

  if(!user){
    return  next( new ErrorHandler("User not found in cache , please logout and login again",401))
  }

  req.user = JSON.parse(user);
  next();
  
})

// validate user role 
export const authorizeRoles = (...roles: string[]) => {
  return async (req:Request, res: Response, next: NextFunction)=> {
    if(!roles.includes(req.user?.role || '')){
      return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`,401));
    }
    next();
  }
}