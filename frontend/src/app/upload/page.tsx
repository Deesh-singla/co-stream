"use client";

import { useState } from "react";
import { ImageIcon, Upload, Video } from "lucide-react";

export default function UploadPage() {
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [loading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(
            "This feature requires ffmpeg installed locally. Run the backend server on your machine and use: POST http://localhost:8000/api/videos/supabase-upload"
        );
    };

    return (
        <main className="min-h-screen bg-white px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Upload Video
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Add a new video to co-stream
                    </p>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6 flex gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-4">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
                            <svg className="h-3 w-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-orange-800">
                                Local access only
                            </p>
                            <p className="mt-0.5 text-sm text-orange-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
                >
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Video Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter video title"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Thumbnail Image
                        </label>
                        <label
                            htmlFor="thumbnail"
                            className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-orange-300 hover:bg-orange-50"
                        >
                            <ImageIcon size={32} className="mb-2 text-gray-400" />
                            {thumbnail ? (
                                <p className="text-sm font-medium text-orange-600">{thumbnail.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-600">
                                        Click to choose thumbnail
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-400">PNG, JPG or WEBP</p>
                                </>
                            )}
                            <input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            />
                        </label>
                    </div>

                    {/* Video */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Video File
                        </label>
                        <label
                            htmlFor="video"
                            className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-orange-300 hover:bg-orange-50"
                        >
                            <Video size={32} className="mb-2 text-gray-400" />
                            {video ? (
                                <p className="text-sm font-medium text-orange-600">{video.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-600">
                                        Click to choose video
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-400">MP4, MKV or WEBM</p>
                                </>
                            )}
                            <input
                                id="video"
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => setVideo(e.target.files?.[0] || null)}
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Upload size={18} />
                        {loading ? "Uploading & Processing..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </main>
    );
}
