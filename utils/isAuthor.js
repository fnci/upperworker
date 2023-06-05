import Groundwork from "../models/groundwork.js";
const isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const groundwork = await Groundwork.findById(id);

    if(!groundwork.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/areas/${id}`);
    }
    next();
};

export default isAuthor;