"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const layout_routes_1 = __importDefault(require("./routes/layout.routes"));
const express_rate_limit_1 = require("express-rate-limit");
//body parser
exports.app.use(express_1.default.json({ limit: "50mb" })); // to support JSON-encoded bodies
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
// cors = CROSS ORIGIN RESOURCE SHARING
exports.app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
//api request limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
// routes
exports.app.use("/api/v1", user_routes_1.default, order_routes_1.default, course_routes_1.default, notification_routes_1.default, analytics_routes_1.default, layout_routes_1.default);
// app.use("/api/v1", courseRouter);
// app.use("/api/v1", orderRouter);
// testing routes
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Test endpoint works",
    });
});
exports.app.get("/test/v2", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Test endpoint  2 works",
    });
});
// unknown route
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
//middleware calls
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
