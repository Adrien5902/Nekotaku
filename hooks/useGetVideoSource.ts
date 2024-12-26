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
    const supportedLecteursName = Object.keys(supportedLecteurs)
    let foundSupportedLecteur: undefined | string = undefined;
    const foundEpisodeLecteur = episode.lecteurs.find(l => {
        const lName = supportedLecteursName.find(lName => l.hostname.includes(lName))
        if (lName) {
            foundSupportedLecteur = lName
        }
        return lName
    })

    if (foundSupportedLecteur && foundEpisodeLecteur) {
        const getVideoFn = supportedLecteurs[foundSupportedLecteur]
        return getVideoFn(foundEpisodeLecteur.url)
    }

    throw new Error("Lecteur not supported")
}

export const supportedLecteurs: Record<string, (url: string) => [Promise<string>, Record<string, string>]> = {
    "sibnet.ru": (url: string) => {
        const headers: Record<string, string> = {
            "Referer": url,
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