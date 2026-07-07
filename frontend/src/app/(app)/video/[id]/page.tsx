import { getVideoById, getVideos } from "@/src/actions/getvideos";
import VideoPlayer from "@/src/components/VideoPlayer";
import OneVideo from "@/src/components/OneVideo";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: Props) {
    const { id } = await params;

    const [video, videos] = await Promise.all([getVideoById(id), getVideos()]);

    if (!video) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <svg className="h-7 w-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-base font-semibold text-gray-700">Video not found</p>
                <p className="text-sm text-gray-400">This video may have been removed.</p>
            </div>
        );
    }

    const recommendations = videos.filter((item) => item._id !== id);

    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6">
            {/* Player */}
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                    {video.title}
                </h1>
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 shadow-md">
                    <VideoPlayer
                        title={video.title}
                        src={video.url}
                        thumbnails={video.image}
                    />
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="mx-auto mt-10 max-w-5xl">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="h-5 w-1 rounded-full bg-orange-500" />
                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                            Recommended
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                        {recommendations.map((item) => (
                            <OneVideo key={item._id} video={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
