"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const layout_model_1 = __importDefault(require("../models/layout.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// create Layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExist = await layout_model_1.default.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler_1.default(`${type} already exist`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };
            await layout_model_1.default.create(banner);
        }
        if (type === "FAQ") {
            const { faq } = req.body; // receiving array input
            // Since we are receiving the input as arrays, we need to destructure it and send it as an object of arrays
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            await layout_model_1.default.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(201).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Edit layout
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = await layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            const data = image.startsWith("https")
                ? bannerData
                : await cloudinary_1.default.v2.uploader.upload(image, {
                    folder: "layout",
                });
            if (bannerData) {
                await cloudinary_1.default.v2.uploader.destroy(bannerData.image.public_id);
            }
            // const myCloud = await cloudinary.v2.uploader.upload(image, {
            //   folder: "layout",
            // });
            const banner = {
                type: "Banner",
                image: {
                    public_id: image.startsWith("https")
                        ? bannerData.banner.image.public_id
                        : data?.public_id,
                    url: image.startsWith("https")
                        ? bannerData.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            };
            await layout_model_1.default.findByIdAndUpdate(bannerData?._id, { banner });
        }
        if (type === "FAQ") {
            const { faq } = req.body; // receiving array input
            // Since we are receiving the input as arrays, we need to destructure it and send it as an object of arrays
            const faqData = await layout_model_1.default.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await layout_model_1.default.findByIdAndUpdate(faqData?._id, {
                type: "FAQ",
                faq: faqItems,
            });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const CategoriesData = await layout_model_1.default.findOne({
                type: "Categories",
            });
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            await layout_model_1.default.findByIdAndUpdate(CategoriesData?._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(201).json({
            success: true,
            message: "Layout updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get layout by type
exports.getLayoutByType = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { type } = req.params;
        const LayoutData = await layout_model_1.default.findOne({ type });
        res.status(201).json({
            success: true,
            LayoutData,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
