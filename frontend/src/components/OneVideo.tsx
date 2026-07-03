"use client"
import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

type Video = {
    _id: string;
    url: string;
    title: string;
    image: string;
};

type OneVideoProps = {
    video: Video;
};

const OneVideo = ({ video }: OneVideoProps) => {
    const router = useRouter();
    function handleClick(video: Video) {
        router.push(`/video/${video._id}`)
    }
    return (
        <div onClick={() => handleClick(video)}>
            <div className="group relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                    src={video.image}
                    alt={video.title}
                    fill
                    className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                    <Play
                        size={42}
                        fill="white"
                        className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                </div>
            </div>

            <h2 className="mt-2 text-base font-semibold">
                {video.title}
            </h2>
        </div>
    );
};

export default OneVideo;