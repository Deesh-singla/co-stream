import { NextRequest, NextResponse } from "next/server";
import VideoModel from "@/src/models/Video";
import { connectDB } from "@/src/lib/db";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const url = await VideoModel.find();
        return NextResponse.json({
            url
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "internal server error"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const urls = [
            {
                title: "solo leveling 1",
                url: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-1/master.m3u8",
                image: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-1/Screenshot%202026-07-03%20231450.png"
            },
            {
                title: "solo leveling 2",
                url: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-2/master.m3u8",
                image: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-2/Screenshot%202026-07-03%20231632.png"
            },
            {
                title: "solo leveling 3",
                url: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-3/master.m3u8",
                image: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-3/Screenshot%202026-07-03%20231647.png"
            },
            {
                title: "dummy",
                url: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-4/master.m3u8",
                image: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-4/Screenshot%202026-07-03%20231711.png"
            },

        ];
        await connectDB();
        await VideoModel.insertMany(
            urls.map((url) => (url))
        );

        return NextResponse.json({ message: "videos added to db" }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}