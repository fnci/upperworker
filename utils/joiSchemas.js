import BJoi from "joi";
import sanitizeHtml from 'sanitize-html';

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML.'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})
const Joi = BJoi.extend(extension);
// Create new schema with joi to validate our data before sending it to mongoose, add second layer of validation on the server side
const areaSchema = Joi.object({
    area: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().min(0).escapeHTML(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required().escapeHTML()
        /*image: Joi.string().required()*/
    }).required(),
    deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


export {areaSchema, reviewSchema};