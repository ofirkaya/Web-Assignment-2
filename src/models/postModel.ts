import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    message: string;
    sender: mongoose.Types.ObjectId;
}

const postSchema: Schema = new Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export default mongoose.model<IPost>("Post", postSchema);
