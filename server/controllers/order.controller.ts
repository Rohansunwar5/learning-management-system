import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import sendMail from "../utils/sendMail";
import { NextFunction, Request, Response } from "express";
import ejs from "ejs";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import NotificationModel from "../models/notification.model";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create order

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized", 400));
          }
        }
      }

      const user = await userModel.findById(req.user?._id);

      const alreadyPurchased = user?.courses.find(
        (course: any) => course._id.toString() === courseId
      );

      if (alreadyPurchased) {
        return next(
          new ErrorHandler("You have alreay purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("course not found", 400));
      }

      const data: any = {
        courseId: course?._id,
        userId: user?._id, // same as req.user._id
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course?._id);

      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();
      // Sending notification to the admin
      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      // course.purchased ? course.purchased += 1 : course.purchased;
      course.purchased = (course.purchased || 0) + 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all order only for admin

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// send stripe publishible key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "Eduception",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
