import type { Episode } from "@/types/AnimeSama";
import { useMemoryCachedPromise, usePromise } from "./usePromise";
import type { Downloader } from "@/components/DownloadingContext";

export function useGetVideoSource(downloadingContext: Downloader, mediaId: number, episode: Episode) {
    if (downloadingContext.downloadedEpisodes[mediaId]?.includes(episode.id)) {
        return usePromise(() => downloadingContext.getDownloadedEpisodeFileUri(mediaId, episode.id), [mediaId, episode.url]);
    }

    return useMemoryCachedPromise("getVideoUri", () => getVideoUri(episode.url)[0], [mediaId, episode.url]);

};

export function getVideoUri(videoSource: string): [Promise<string>, Record<string, string>] {
    const headers: Record<string, string> = {
        "Referer": videoSource,
    }

    return [new Promise((resolve) => {
        (async () => {
            const response = await fetch(videoSource);
            const html = await response.text();

            const videoSrcMatch = html.match(/player\.src\(\[\{src: "(.*?)",/);
            if (!videoSrcMatch)
                throw new Error("Video source not found in JavaScript.");

            const videoPath = videoSrcMatch[1];
            const fullVideoUrl = `https://video.sibnet.ru${videoPath}`;

            const request = new XMLHttpRequest();
            const listener = () => {
                if (request.responseURL) {
                    request.removeEventListener("readystatechange", listener);
                    resolve(request.responseURL);
                }
            };

            request.addEventListener("readystatechange", listener);
            request.open("GET", fullVideoUrl);
            const headersKeys = Object.keys(headers)
            for (const i in headersKeys) {
                request.setRequestHeader(headersKeys[i], headers[headersKeys[i]])
            }
            request.send();
        })()
    }), headers]
}