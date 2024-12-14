import type { Episode } from "@/types/AnimeSama";
import type { Downloader } from "@/components/DownloadingContext";
import { useCachedPromise } from "./usePromise";
import { CacheReadType } from "./useCache";

export function useGetVideoSource(downloadingContext: Downloader, mediaId: number, episode: Episode | undefined) {
    return useCachedPromise(CacheReadType.Memory, "videoUri", () => {
        if (!episode) {
            throw new Error("Episode not found")
        }

        if (downloadingContext.downloadedEpisodes[mediaId]?.includes(episode.id ?? 0)) {
            return downloadingContext.getDownloadedEpisodeFileUri(mediaId, episode.id ?? 0)
        }

        return getVideoUri(episode)[0]
    },
        [mediaId, episode?.id ?? 0]
    );
};

export function getVideoUri(episode: Episode): [Promise<string>, Record<string, string>] {
    console.log(episode.lecteurs);
    const sibnetLecteur = episode?.lecteurs.find(l => l.hostname.includes("sibnet.ru"));

    if (!sibnetLecteur?.url) {
        throw new Error("Can't use this lecteur")
    }

    const videoSource = sibnetLecteur.url;

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