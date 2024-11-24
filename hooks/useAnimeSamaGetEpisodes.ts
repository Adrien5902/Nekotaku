import type { AnimeSamaUrl, EpisodeId, EpisodeName, Lang, Lecteur } from "@/types/AnimeSama";
import DiskCache from "./useDiskCache";

export function useAnimeSamaGetLecteurs(url: AnimeSamaUrl | undefined, currentLang: keyof typeof Lang | null, customEpisodes?: { id: EpisodeId, name: EpisodeName }[]) {
    return DiskCache.useWithMemory(
        "useAnimeSamaGetLecteurs",
        async () => {
            if (url && currentLang) {
                url.lang = currentLang;
                return getAnimeSamaLecteurs(url, customEpisodes)
            }
            return undefined
        },
        [currentLang, url]
    )
}

export async function getAnimeSamaLecteurs(url: AnimeSamaUrl, customEpisodes?: { id: EpisodeId, name: EpisodeName }[]) {
    if (!url.lang) {
        throw new Error("Must specify a lang to get lecteur")
    }

    const episodesJs = await (await fetch(`${url.makeURL()}/episodes.js`)).text();
    const result: Lecteur[] = []
    const regex = /var\s+eps(\d+)\s*=\s*\[\s*([\s\S]*?)\s*\];/g;
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((match = regex.exec(episodesJs)) !== null) {
        const id = Number.parseInt(match[1], 10);
        const links = match[2]
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("'"))
            .map((link) => link.replaceAll("'", "").replaceAll(",", ""));
        const hostname = new URL(links[0]).hostname;

        result.push({
            id, hostname, episodes: links.map((link, i) => {
                const lastEp = customEpisodes?.[customEpisodes.length - 1];
                return {
                    url: link,
                    ...(customEpisodes?.[i] ? customEpisodes[i] : { id: i, name: lastEp && typeof lastEp.name === "number" ? lastEp.name + (i - lastEp.id) : i + 1 })
                }
            })
        });
    }

    if (!result.length) {
        throw new Error("Season's episodes not found on AnimeSama")
    }


    return result
}