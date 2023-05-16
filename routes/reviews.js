import express from "express";
const router = express.Router({mergeParams: true});
import Groundwork from "../models/groundwork.js";
import Review from "../models/review.js";
import catchAsync from "../utils/catchAsync.js";
import validateReview from "../utils/validateReview.js";
import isReviewAuthor from "../utils/isReviewAuthor.js";
import isLoggedIn from "../utils/isLoggedIn.js";


router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        area.reviews.push(review);
        await review.save();
        await area.save();

        req.flash('success', 'New Review!');

        res.redirect(`/areas/${area._id}`);
    }));
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Groundwork.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash('success', 'Successfully Deleted Review!');

        res.redirect(`/areas/${id}`);
    }));

export default router;