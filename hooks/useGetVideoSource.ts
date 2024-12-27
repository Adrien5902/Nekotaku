import type { EpisodeId, Lecteur } from "@/types/AnimeSama";
import type { Downloader } from "@/components/DownloadingContext";
import { useCachedPromise } from "./usePromise";
import { CacheReadType } from "./useCache";

export function useGetVideoSource(downloadingContext: Downloader, mediaId: number, episodeId: EpisodeId | undefined, selectedLecteur?: Lecteur) {
    if (!selectedLecteur) {
        throw new Error("Lecteur not selected")
    }

    return useCachedPromise(CacheReadType.Memory, "videoUri", () => {
        if (episodeId === undefined) {
            throw new Error("Episode not found")
        }

        if (downloadingContext.downloadedEpisodes[mediaId]?.includes(episodeId ?? 0)) {
            return downloadingContext.getDownloadedEpisodeFileUri(mediaId, episodeId ?? 0)
        }

        return getVideoUri(selectedLecteur)[0]
    },
        [mediaId, episodeId ?? 0, selectedLecteur.url]
    );
};

export function getVideoUri(selectedLecteur?: Lecteur): [Promise<string>, Record<string, string>] {
    if (selectedLecteur) {
        const supportedLecteursName = Object.keys(supportedLecteurs) as SupportedLecteurs[]
        const supportedLecteur = supportedLecteursName.find((l) => selectedLecteur?.hostname.includes(l));

        if (supportedLecteur) {
            const getVideoFn = supportedLecteurs[supportedLecteur]
            return getVideoFn(selectedLecteur.url)
        }
    }

    throw new Error("Lecteur not supported")
}

/**
 * @param url the url of the episode 
 * @returns [a promise which resolves into the url of the video, the headers that should be used when fetching the video] 
 */
export type GetVideoSourceFromLecteurFunc = (url: string) => [Promise<string>, Record<string, string>]
export type SupportedLecteurs = "sibnet.ru" | "sendvid.com"

export const supportedLecteurs: Record<SupportedLecteurs, GetVideoSourceFromLecteurFunc> = {
    "sibnet.ru": (url: string) => {
        const headers: Record<string, string> = {
            "Referer": url,
            "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        }

        return [(async () => {
            const response = await fetch(url, { headers });
            const html = await response.text();

            const videoSrcMatch = html.match(/player\.src\(\[\{src: "(.*?)",/);
            if (!videoSrcMatch)
                throw new Error("Video source not found in JavaScript.");

            const videoPath = videoSrcMatch[1];
            const fullVideoUrl = `https://video.sibnet.ru${videoPath}`;

            const request = new XMLHttpRequest();

            return await new Promise((resolve) => {
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
            })
        })(), headers]
    },
    "sendvid.com": (url: string) => {
        return [(async () => {
            const res = await fetch(url)
            const html = await res.text()
            const regex = /<meta property="og:video" content="([\S]*)"\/>/g

            return Array.from(html.matchAll(regex))[0][1]
        })(), {}]
    }
}