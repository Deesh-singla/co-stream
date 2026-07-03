import { Schema, model, models } from "mongoose";

const videoSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            default: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/thumbnail-not-found.png",
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

export default models.Video || model("Video", videoSchema);