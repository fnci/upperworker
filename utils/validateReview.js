import ExpressError from "../utils/ExpressError.js";
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

export default validateReview;