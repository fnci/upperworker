import Joi from "joi";

// Create new schema with joi to validate our data before sending it to mongoose, add second layer of validation on the server side
export const areaSchema = Joi.object({
    area: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().min(0),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


export default {areaSchema, reviewSchema};