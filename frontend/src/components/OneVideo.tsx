"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

type Video = {
    _id: string;
    url: string;
    title: string;
    image: string;
};

const OneVideo = ({ video }: { video: Video }) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/video/${video._id}`)}
            className="group cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-orange-200">
                <Image
                    src={video.image}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 sm:h-12 sm:w-12">
                        <Play size={18} fill="white" className="translate-x-px text-white" />
                    </div>
                </div>
            </div>

            {/* Title */}
            <h2 className="mt-2.5 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors sm:text-base">
                {video.title}
            </h2>
        </div>
    );
};

export default OneVideo;
