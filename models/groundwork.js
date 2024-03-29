import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import Review from "./review.js";
/* const Schema = mongoose.Schema; */

/* https://res.cloudinary.com/ddqiasrsz/image/upload/w_200/v1684992136/upperworker/y22dz63dc88wzpq1t5cy.jpg */
/* https://res.cloudinary.com/ddqiasrsz/image/upload/c_fill,h_300,w_500/cld-sample-2.jpg */


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_scale,w_200');
});

const opts = { toJSON: { virtuals: true } };

const GroundworkSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            // the objectId from the Review model
            ref: 'Review'
        }
    ]
}, opts);

GroundworkSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a style="text-decoration:none" href="/areas/${this._id}">
    ${this.title}
    </a>
    <p>${this.description.substring()}...</p>`
});

GroundworkSchema.post('findOneAndDelete', async (doc) => {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    };
});

const Groundwork = model('Groundwork', GroundworkSchema);
export default Groundwork;
