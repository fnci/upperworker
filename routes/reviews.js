import express from "express";
const router = express.Router({mergeParams: true});
import catchAsync from "../utils/catchAsync.js";
import validateReview from "../utils/validateReview.js";
import isReviewAuthor from "../utils/isReviewAuthor.js";
import isLoggedIn from "../utils/isLoggedIn.js";
// Controller
import {newReview, deleteReview} from "../controllers/reviewController.js"


router.post(
    '/',
    isLoggedIn,
    validateReview,
    catchAsync(newReview)
);
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(deleteReview)
);

export default router;