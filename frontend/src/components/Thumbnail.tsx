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
    return (
        <div className="grid max-w-5xl grid-cols-3 gap-5 p-4 mx-auto">
            {videos.map((video) => (
                <OneVideo
                    key={video._id}
                    video={video}
                />
            ))}
        </div>
    );
};

export default Thumbnail;