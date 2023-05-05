import express from "express";
const router = express.Router({mergeParams: true});

import Groundwork from "../models/groundwork.js";
import Review from "../models/review.js";

import ExpressError from "../utils/ExpressError.js";
import catchAsync from "../utils/catchAsync.js";

import { reviewSchema } from "../utils/joiSchemas.js";

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id);
        const review = new Review(req.body.review);
        area.reviews.push(review);
        await review.save();
        await area.save();
        res.redirect(`/areas/${area._id}`);
    }));
router.delete(
    "/:reviewId",
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Groundwork.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/areas/${id}`);
    }));

export default router;