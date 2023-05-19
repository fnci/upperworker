import Groundwork from "../models/groundwork.js";

export const index = async (req, res) => {
    const areas = await Groundwork.find({});
    res.render("areas/index", { areas });
}
export const newArea = (req, res) => {
    res.render("areas/new");
}
export const createArea = async (req, res, next) => {
    const area = new Groundwork(req.body.area);
    area.author = req.user._id;
    await area.save();
    req.flash('success', 'Successfully Made a New Area');
    res.redirect(`/areas/${area._id}`);
}
export const showArea = async (req, res) => {
    const area = await Groundwork.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!area) {
        req.flash('error', 'Cannot find that area');
        return res.redirect("/areas")
    };
    res.render("areas/show", { area });
}
export const editArea = async (req, res) => {
    const { id } = req.params;
    const area = await Groundwork.findById(id);
    if (!area) {
        req.flash('error', 'Cannot find that area');
        return res.redirect("/areas")
    };
    res.render("areas/edit", { area });
}
export const updateArea = async (req, res) => {
    const { id } = req.params;
    const area = await Groundwork.findByIdAndUpdate(id, { ...req.body.area });
    req.flash('success', 'Successfully Updated Area');
    res.redirect(`/areas/${area._id}`);
}
export const deleteArea = async (req, res) => {
    const { id } = req.params;
    await Groundwork.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Area!');
    res.redirect("/areas");
}


export default {index, newArea, createArea, showArea, editArea, updateArea, deleteArea}