import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    post: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    message: string;
}

const commentSchema: Schema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IComment>("Comment", commentSchema);
