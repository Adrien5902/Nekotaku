import type { AnimeSamaUrl, Episode, EpisodeId, EpisodeName, Lang } from "@/types/AnimeSama";
import { useCachedPromise } from "./usePromise";
import { CacheReadType } from "./useCache";

export function useAnimeSamaGetEpisodes(url: AnimeSamaUrl | undefined, currentLang: keyof typeof Lang | null, customEpisodes?: { id: EpisodeId, name: EpisodeName }[]) {
    return useCachedPromise(
        CacheReadType.MemoryAndIfNotDisk,
        "animeSamaEpisodes",
        async () => {
            if (url && currentLang) {
                url.lang = currentLang;
                return getAnimeSamaEpisodes(url, customEpisodes)
            }
            return undefined
        },
        [currentLang, url?.animeName, url?.season, url?.horsSerie, url?.type]
    )
}

export async function getAnimeSamaEpisodes(url: AnimeSamaUrl, customEpisodes?: { id: EpisodeId, name: EpisodeName }[]) {
    if (!url.lang) {
        throw new Error("Must specify a lang to get lecteur")
    }

    const episodesJs = await (await fetch(`${url.makeURL()}/episodes.js`)).text();
    const result: Episode[] = []
    const regex = /var\s+eps(\d+)\s*=\s*\[\s*([\s\S]*?)\s*\];/g;
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((match = regex.exec(episodesJs)) !== null) {
        const lecteurId = Number.parseInt(match[1], 10);
        const urls = match[2]
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("'"))
            .map((link) => link.replaceAll("'", "").replaceAll(",", ""));

        for (const i in urls) {
            const episodeId = Number.parseInt(i)
            const lastEp = customEpisodes?.[customEpisodes.length - 1];
            const url = urls[episodeId];
            const customEp = customEpisodes?.find((e) => e.id === episodeId);

            const name = customEp?.name ? customEp.name : typeof lastEp?.name === "number" ? lastEp?.name + (episodeId - (lastEp?.id ?? 0)) : episodeId + 1;

            if (!result[episodeId]) {
                result.push({
                    id: episodeId,
                    lecteurs: [],
                    name
                })
            }
            result[episodeId].lecteurs.push({ id: lecteurId, hostname: new URL(url).hostname, url: url })
        }
    }

    if (!result.length) {
        throw new Error("Season's episodes not found on AnimeSama")
    }

    return result
}