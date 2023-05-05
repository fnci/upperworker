import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { areaSchema } from "../utils/joiSchemas.js";
// Models
import Groundwork from "../models/groundwork.js";

const validateArea = (req, res, next) => {
    const { error } = areaSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get(
    "/",
    catchAsync(async (req, res) => {
        const areas = await Groundwork.find({});
        res.render("areas/index", { areas });
    })
);
router.get(
    "/new",
    catchAsync(async (req, res) => {
        res.render("areas/new");
    })
);
// Post to make our new area
router.post(
    "/",
    validateArea,
    catchAsync(async (req, res, next) => {
        /* if(!req.body.area) throw new ExpressError("Invalid Area Data", 400); */
        const area = new Groundwork(req.body.area);
        await area.save();
        res.redirect(`/areas/${area._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id).populate('reviews');
        res.render("areas/show", { area });
    })
);
router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
        const area = await Groundwork.findById(req.params.id);
        res.render("areas/edit", { area });
    })
);
router.put(
    "/:id",
    validateArea,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const area = await Groundwork.findByIdAndUpdate(id, { ...req.body.area });
        res.redirect(`/areas/${area._id}`);
    })
);
router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Groundwork.findByIdAndDelete(id);
        res.redirect("/areas");
    })
);


export default router;