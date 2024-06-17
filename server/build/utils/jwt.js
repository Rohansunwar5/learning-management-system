"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// Parse environment variables to integrate with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);
// Options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true, // if set to true, the cookie cannot be accessed via JavaScript on the client side. This is a security measure to prevent cross-site scripting (XSS) attacks.
    sameSite: 'lax',
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};
const sendToken = (user, statusCode, res) => {
    try {
        const accessToken = user.SignAccessToken();
        const refreshToken = user.SignRefreshToken();
        // Upload session to Redis
        // After a successful login, add the user session to the Redis database
        redis_1.redis.set(user._id, JSON.stringify(user));
        // Only set secure to true in production
        if (process.env.NODE_ENV === 'production') {
            exports.accessTokenOptions.secure = true;
            exports.refreshTokenOptions.secure = true;
        }
        res.cookie("access_token", accessToken, exports.accessTokenOptions); // Sets the access token in a cookie with the specified options.
        res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
        res.status(statusCode).json({
            success: true,
            user,
            accessToken,
        });
    }
    catch (error) {
        console.error('Error sending token:', error);
        throw new Error('Failed to send token');
    }
};
exports.sendToken = sendToken;
