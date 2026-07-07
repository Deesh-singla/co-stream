import { getVideos } from "@/src/actions/getvideos";
import Thumbnail from "@/src/components/Thumbnail";

export default async function DashboardPage() {
    const videos = await getVideos();

    return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and watch your videos
                    </p>
                </div>
                <Thumbnail videos={videos} />
            </div>
        </div>
    );
}
