import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    owner: String,
    repo: String,
    sha: String,
    review: Object
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
