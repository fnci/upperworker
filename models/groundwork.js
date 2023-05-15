import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import Review from "./review.js";
/* const Schema = mongoose.Schema; */


const GroundworkSchema = new Schema({
    title: String,
    price: Number,
    image: String,
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
