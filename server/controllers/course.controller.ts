import { NextFunction, Request, Response } from "express";

import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

// upload course 
export const uploadCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
  try {
    
    const data = req.body;
    const thumbnail = data.thumbnail;
    if(thumbnail){
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'courses'
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }

    createCourse(data, res,next);


  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// adit course 

export const editCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=> {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;

    if(thumbnail){
      // delete previous one 
      await cloudinary.v2.uploader.destroy(thumbnail?.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'courses',
      })

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const courseId = req.params.id; // taking the course id 

    const course = await CourseModel.findByIdAndUpdate(
      courseId, 
      {
        $set: data,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      course,
    });

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// get single course  -- without purchasing
// everyone can access this root 
export const getSingleCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
  try {
// NOTE: So to handle the server req with multiple users we check if the cache memory exist in users device, if exist we simply send from the redis else we check from the mongodb
    let courseId = req.params.id;

    const isCacheExist = await redis.get(courseId);

    console.log('hitting redis');

    if(isCacheExist){
      const course = JSON.parse(isCacheExist);
      res.status(201).json({
        success: true,
        course,
      });
    }
    else {
      const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"); // we are avoiding sending this data so that the users cant acces it throught the network tab
      console.log('hitting mongodb');
      
      // after getting the data we set the cache  to it 
      await redis.set(courseId, JSON.stringify(course));

      res.status(200).json({
        success: true,
        course,
      })

    }

  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// get all courses -- without purchasing

export const getAllCourses = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
  try {

    const isCacheExist = await redis.get("allCourses");
    
    if(isCacheExist){
      const courses = JSON.parse(isCacheExist);
      console.log('hitting redis');
      
      res.status(201).json({
        success: true,
        courses,
      })
    } else {
      const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
      
      console.log('hitting mongodb');
      

      await redis.set('allCourses', JSON.stringify(courses));

      res.status(201).json({
        success: true,
        courses,
      })
    }

  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
})


// getting course content  -- only for valid user 

export const getCourseByUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists =  userCourseList?.find((course:any) => course._id.toString() === courseId);

    if(!courseExists){
      return next(new ErrorHandler("You are not eligible for this course ", 404));
    }

    const course = await CourseModel.findById(courseId);

    const content = course?.courseData;

    res.status(200).json({
      success: true,
      content,
    })

  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
})