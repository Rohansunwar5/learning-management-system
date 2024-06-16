require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";
import orderRouter from "./routes/order.routes";
import notificationRouter from "./routes/notification.routes";
import analyticsRouter from "./routes/analytics.routes";
import layoutRouter from "./routes/layout.routes";
import { rateLimit } from "express-rate-limit";

//body parser
app.use(express.json({ limit: "50mb" })); // to support JSON-encoded bodies

// cookie parser
app.use(cookieParser());

// cors = CROSS ORIGIN RESOURCE SHARING
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

//api request limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// routes
app.use(
  "/api/v1",
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// app.use("/api/v1", courseRouter);

// app.use("/api/v1", orderRouter);

// testing routes
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint works",
  });
});
app.get("/test/v2", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint  2 works",
  });
});

// unknown route

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

//middleware calls
app.use(limiter);

app.use(ErrorMiddleware);
