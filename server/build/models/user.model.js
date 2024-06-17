"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your mail"],
        unique: true,
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value); // test() examines the regular expression weather it matches with the value or not
            },
            message: "please enter a valid email "
        },
    },
    password: {
        type: String,
        // required:[true, "Please provide a password"],
        minlength: [6, "Password must be atleast 6 characters"],
        select: false //hides the password field
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        }
    ],
}, { timestamps: true });
//Hash Password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) { // checking
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
//sign access token 
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: "5m",
    });
};
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: '7d',
    });
};
//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
