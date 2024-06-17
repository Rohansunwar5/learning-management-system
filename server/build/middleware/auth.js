"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
// interface AuthenticatedRequest extends Request {
//   user?: IUser;
// }
// authenticated user  middleware to check if a token is provided in the header and verify it. 
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    // console.log(req.cookies);
    const access_token = req.cookies.access_token;
    // console.log(access_token);
    if (!access_token) {
        return next(new ErrorHandler_1.default("please login to access this resource ", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.default("Invalid token", 401));
    }
    const user = await redis_1.redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("User not found in cache , please logout and login again", 401));
    }
    req.user = JSON.parse(user);
    next();
});
// validate user role 
const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler_1.default(`Role: ${req.user?.role} is not allowed to access this resource`, 401));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
