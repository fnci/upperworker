import express from "express";
const router = express.Router({mergeParams: true});
import Groundwork from "../models/groundwork.js";
import Review from "../models/review.js";
import catchAsync from "../utils/catchAsync.js";
import validateReview from "../utils/validateReview.js";


router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id);
        const review = new Review(req.body.review);
        area.reviews.push(review);
        await review.save();
        await area.save();

        req.flash('success', 'New Review!');

        res.redirect(`/areas/${area._id}`);
    }));
router.delete(
    "/:reviewId",
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Groundwork.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash('success', 'Successfully Deleted Review!');

        res.redirect(`/areas/${id}`);
    }));

export default router;