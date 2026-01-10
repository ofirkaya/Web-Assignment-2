import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    message: string;
    sender: string;
}

const postSchema: Schema = new Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IPost>("Post", postSchema);
