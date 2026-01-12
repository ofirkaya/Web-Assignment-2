import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    post: string;
    sender: string;
    message: string;
}

const commentSchema: Schema = new Schema({
    post: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IComment>("Comment", commentSchema);
