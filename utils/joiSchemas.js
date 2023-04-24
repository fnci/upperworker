import Joi from "joi";

// Create new schema with joi to validate our data before sending it to mongoose, add second layer of validation on the server side
const areaSchema = Joi.object({
    area: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().min(50).max(300),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

export {areaSchema};
