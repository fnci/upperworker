import Groundwork from '../models/groundwork.js';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
import {cloudinary} from '../cloudinary.js';

const index = async (req, res) => {
    const areas = await Groundwork.find({});
    res.render("areas/index", { areas });
}
const newArea = (req, res) => {res.render("areas/new");}
const createArea = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.area.location,
        limit: 1
    }).send();
    const area = new Groundwork(req.body.area);
    area.geometry = geoData.body.features[0].geometry;
    area.images = req.files.map(file => ({
        url: file.path, filename: file.filename
    }));
    area.author = req.user._id;
    await area.save();
    /* console.log(area); */

    req.flash('success', 'Successfully Made a New Area');
    res.redirect(`/areas/${area._id}`);
}
const showArea = async (req, res) => {
    const area = await Groundwork.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!area) {
        req.flash('error', 'Cannot find that area.');
        return res.redirect("/areas")
    };
    res.render("areas/show", { area });
}
const editArea = async (req, res) => {
    const { id } = req.params;
    const area = await Groundwork.findById(id);
    if (!area) {
        req.flash('error', 'Cannot find that area');
        return res.redirect("/areas")
    };
    res.render("areas/edit", { area });
}
const updateArea = async (req, res) => {
    const { id } = req.params;
    const area = await Groundwork.findByIdAndUpdate(id, { ...req.body.area });
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    area.images.push(...imgs);
    await area.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await area.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Area Successfully Updated');
    res.redirect(`/areas/${area._id}`);
}
const deleteArea = async (req, res) => {
    const { id } = req.params;
    await Groundwork.findByIdAndDelete(id);
    req.flash('success', 'Area Successfully Deleted');
    res.redirect("/areas");
}


export {index, newArea, createArea, showArea, editArea, updateArea, deleteArea}