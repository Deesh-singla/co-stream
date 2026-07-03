import { getVideos } from "@/src/actions/getvideos";
import Logout from "@/src/components/button/Logout";
import Thumbnail from "@/src/components/Thumbnail";

const page = async () => {
    const videos = await getVideos();

    return (
        <div>
            <h1>dashboard</h1>

            <Logout />

            <Thumbnail videos={videos} />
        </div>
    );
};

export default page;