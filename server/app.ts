require('dotenv').config();

import express, { NextFunction , Request, Response} from 'express';
export const app = express();
import cors from "cors";
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.routes';

//body parser 
app.use(express.json({limit:"50mb"})); // to support JSON-encoded bodies

// cookie parser 
app.use(cookieParser());

// cors = CROSS ORIGIN RESOURCE SHARING
app.use(cors({
  origin: process.env.ORIGIN
}));

// routes
app.use("/api/v1", userRouter);

// testing routes
app.get('/test', (req:Request,res:Response,next:NextFunction)=> {
  res.status(200).json({
    success: true, 
    message: 'Test endpoint works'
  });
});
app.get('/test/v2', (req:Request,res:Response,next:NextFunction)=> {
  res.status(200).json({
    success: true, 
    message: 'Test endpoint  2 works'
  });
});

// unknown route 

app.all("*",(req: Request, res: Response, next: NextFunction)=> {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
})

app.use(ErrorMiddleware);