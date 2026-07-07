"use server";

import { connectDB } from "@/src/lib/db";
import VideoModel from "@/src/models/Video";

export const getVideos = async () => {
    try {
        await connectDB();

        const videos = await VideoModel.find().lean();

        const plainVideos = videos.map((video) => ({
            _id: String(video._id),
            url: String(video.url),
            title: String(video.title),
            image: String(video.image),
        }));

        return plainVideos;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getVideoById = async (id: string) => {
    try {
        await connectDB();
        const video = await VideoModel.findById(id).lean();
        if (!video) return null;
        return {
            _id: String(video._id),
            url: String(video.url),
            title: String(video.title),
            image: String(video.image),
        };
    } catch (err) {
        console.log(err);
        return null;
    }
}