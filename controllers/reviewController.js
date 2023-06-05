import Groundwork from "../models/groundwork.js";
import Review from "../models/review.js";

const newReview = async (req, res) => {
    const area = await Groundwork.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    area.reviews.push(review);
    await review.save();
    await area.save();
    req.flash('success', 'New Review!');
    res.redirect(`/areas/${area._id}`);
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Groundwork.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', ' Review Successfully Deleted!');
    res.redirect(`/areas/${id}`);
}

export {newReview, deleteReview}