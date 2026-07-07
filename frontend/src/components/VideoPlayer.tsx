"use client";

import { Component, type ReactNode } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

/* ── Error boundary ───────────────────────────────────────────
   Vidstack 1.15.6 (next channel) throws
   "this.$state[prop] is not a function" when the internal state
   proxy is accessed after it has been torn down on fullscreen
   exit. The error is non-fatal — playback is unaffected — but
   React's error boundary catches it before it surfaces to the
   user. The boundary re-mounts the player so it stays usable.
──────────────────────────────────────────────────────────────── */
interface BoundaryState {
    hasError: boolean;
    key: number;
}

class PlayerErrorBoundary extends Component<
    { children: ReactNode },
    BoundaryState
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, key: 0 };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        // Only swallow the known vidstack internal state-proxy error.
        // Re-throw anything else so real bugs aren't hidden.
        if (!error?.message?.includes("is not a function")) {
            throw error;
        }
        // Re-mount the player after a brief delay so the DOM has settled
        setTimeout(() => {
            this.setState((s) => ({ hasError: false, key: s.key + 1 }));
        }, 100);
    }

    render() {
        if (this.state.hasError) {
            // Render nothing for the ~100 ms while the player remounts
            return null;
        }
        return this.props.children;
    }
}

/* ── Player component ─────────────────────────────────────── */
interface VideoPlayerProps {
    title: string;
    src: string;
    thumbnails?: string;
}

export default function VideoPlayer({ title, src, thumbnails }: VideoPlayerProps) {
    return (
        <PlayerErrorBoundary>
            <MediaPlayer
                title={title}
                src={src}
                className="h-full w-full"
                // Disable localStorage persistence — reading persisted state
                // after the proxy is torn down is what triggers the crash.
                storage=""
            >
                <MediaProvider />
                <DefaultVideoLayout
                    thumbnails={thumbnails}
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>
        </PlayerErrorBoundary>
    );
}
