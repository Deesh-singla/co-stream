import OneVideo from "./OneVideo";

type Video = {
    _id: string;
    url: string;
    title: string;
    image: string;
};

type ThumbnailProps = {
    videos: Video[];
};

const Thumbnail = ({ videos }: ThumbnailProps) => {
    if (videos.length === 0) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                    <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-base font-semibold text-gray-700">No videos yet</p>
                <p className="mt-1 text-sm text-gray-400">Uploaded videos will appear here</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {videos.map((video) => (
                <OneVideo key={video._id} video={video} />
            ))}
        </div>
    );
};

export default Thumbnail;
