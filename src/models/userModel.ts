import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    imgUrl?: string;
    refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
    },
    refreshTokens: {
        type: [String],
        required: false,
    },
});

export default mongoose.model<IUser>("User", userSchema);
