import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const VideoModel =
    mongoose.models.Video || mongoose.model("Video", videoSchema);

export default VideoModel;