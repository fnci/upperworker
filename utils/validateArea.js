import ExpressError from "../utils/ExpressError.js";
import { areaSchema } from "../utils/joiSchemas.js";

const validateArea = (req, res, next) => {
    const { error } = areaSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


export default validateArea;