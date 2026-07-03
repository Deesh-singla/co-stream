import { getVideoById, getVideos } from "@/src/actions/getvideos";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

import OneVideo from "@/src/components/OneVideo";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const page = async ({ params }: Props) => {
    const { id } = await params;

    const [video, videos] = await Promise.all([
        getVideoById(id),
        getVideos(),
    ]);

    if (!video) {
        return <h1>Video not found</h1>;
    }

    const recommendations = videos.filter(
        (item) => item._id !== id
    );

    return (
        <div className="p-6">
            <div className="mx-auto w-[800px] max-w-[90vw]">
                <h1 className="mb-3 text-xl font-semibold">
                    {video.title}
                </h1>

                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <MediaPlayer
                        title={video.title}
                        src={video.url}
                        className="h-full w-full"
                    >
                        <MediaProvider />

                        <DefaultVideoLayout
                            thumbnails={video.image}
                            icons={defaultLayoutIcons}
                        />
                    </MediaPlayer>
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-5xl">
                <h2 className="mb-4 text-2xl font-semibold">
                    Recommended Videos
                </h2>

                <div className="grid grid-cols-3 gap-5">
                    {recommendations.map((item) => (
                        <OneVideo
                            key={item._id}
                            video={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default page;