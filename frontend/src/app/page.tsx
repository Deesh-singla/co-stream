import { getVideos } from "@/src/actions/getvideos";
import Thumbnail from "@/src/components/Thumbnail";

const page = async () => {
    const videos = await getVideos();

    return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        All Videos
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Browse and watch all available videos
                    </p>
                </div>
                <Thumbnail videos={videos} />
            </div>
        </div>
    );
};

export default page;
