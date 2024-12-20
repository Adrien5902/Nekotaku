import { MediaStatus, type Media, type MediaTitle } from "@/types/Anilist/graphql";
import { DOMParser } from 'react-native-html-parser';
import Cache, { CacheReadType } from "./useCache";
import { useCachedPromise } from "./usePromise";

interface SeasonData {
    season: number;
    part: number | null;
}

export type AnimeSamaSearchMediaType = Pick<Media, "synonyms" | "format" | "status"> & {
    title?: Pick<MediaTitle, "english" | "romaji"> | null | undefined
} | null | undefined

export function useAnimeSamaSearch(media?: AnimeSamaSearchMediaType) {
    return useCachedPromise(CacheReadType.MemoryAndIfNotDisk, "animeSamaSearch", async () => {
        if (!media) {
            return undefined
        }

        if (media.status === MediaStatus.Cancelled || media.status === MediaStatus.NotYetReleased) {
            throw new Error("Media not yet released")
        }

        const searchRes = await searchMedia(media)
        if (!searchRes) {
            throw new Error("Anime not found on AnimeSama")
        }
        return searchRes
    }, [media])
}

export async function searchResultHTML(query: string): Promise<string> {
    const res = await fetch("https://anime-sama.fr/template-php/defaut/fetch.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            query,
        }).toString(),
    });

    const html = await res.text();
    return html;
}

interface SearchResult {
    title: string,
    subtitles: string[],
    url: string,
}

export function parseSearchResultFromHTML(html: string): SearchResult[] {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    const links = document.getElementsByTagName('a');

    const results: SearchResult[] = [];
    for (let i = 0; i < links.length; i++) {
        const linkElement = links[i];
        const href = linkElement.getAttribute('href');

        if (href?.includes('/catalogue/')) {
            const titleElement = linkElement.getElementsByTagName('h3')[0];
            const title = titleElement ? titleElement.textContent.trim() : '';

            const subtitleElement = linkElement.getElementsByTagName('p')[0];

            const subtitles = subtitleElement ? (subtitleElement.textContent as string).split(',').map(s => s.trim()) : [];
            results.push({ title, url: href, subtitles });
        }
    }
    return results
}

export async function search(query: string) {
    return parseSearchResultFromHTML(await searchResultHTML(query))
}

export async function searchExactMatch(query: string) {
    const results = await search(query);
    return results.find(s => searchFriendly(s.title) === query || s.subtitles.map(st => searchFriendly(st).includes(query)))
}

function getSeasonFromString(s: string): ApplyTitleResult<SeasonData> | null {
    const seasonDigitRegex = /season (\d+)/gim;
    const seasonDigitThRegex = /(\d+)(?:st|nd|rd|th) season/gim;
    const seasonEndOfStrDigitRegex = / (\b\d)$/gim
    const seasonNameRegex = /(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth) season/gim;

    const partRegex = /part (\d+)/gim
    const partMatch = s.matchAll(partRegex).next().value;
    let newString = s;
    let part: number | null = null;
    if (partMatch) {
        newString = s.replace(partMatch[0], "")
        part = partMatch ? Number.parseInt(partMatch[1]) : null
    }

    for (const regex of [seasonDigitRegex, seasonDigitThRegex, seasonEndOfStrDigitRegex]) {
        const match = newString.matchAll(regex).next().value
        if (match) {
            return { newString: newString.replace(match[0], ""), data: { season: Number.parseInt(match[1]), part } }
        }
    }

    const seasonNameMatch = newString.matchAll(seasonNameRegex).next().value
    if (seasonNameMatch) {
        const season = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"].indexOf(seasonNameMatch[1]) + 1;
        return { newString: newString.replace(seasonNameMatch[0], ""), data: { part, season } }
    }

    return { newString, data: { season: 1, part } }
}

function getFormatData(media: AnimeSamaSearchMediaType): {
    urlAppending: (data?: SeasonData) => string
    searchResultApplyTitle?: (s: string) => ApplyTitleResult<SeasonData> | null,
} {
    switch (media?.format) {
        case "MOVIE":
            return {
                urlAppending: () => "film"
            }

        case "OVA":
            return {
                urlAppending: () => "oav"
            }

        case "MANGA":
            return {
                urlAppending: () => "scan"
            }

        default: {
            return {
                searchResultApplyTitle: getSeasonFromString,
                urlAppending: (data?: {
                    season: number;
                    part: number | null;
                    // biome-ignore lint/style/useTemplate: <explanation>
                }) => data?.season ? "saison" + data.season : "saison1"
            };
        }
    }
}

interface ApplyTitleResult<T> { newString: string, data: T };
type ApplyTitle<T> = (s: string) => ApplyTitleResult<T> | null;
async function searchTitles<T>(media: AnimeSamaSearchMediaType, apply?: ApplyTitle<T>): Promise<AnimeSamaSearch<T> | undefined> {
    for (const synonym of searchFriendlyMediaNames(media)) {
        const { newString, ...data } = apply ? apply(synonym) ?? { newString: null } : { newString: synonym };
        if (!newString) {
            continue
        }

        const result = await searchExactMatch(searchFriendly(newString.split(":")[0]))
        if (result) {
            return { result, ...data }
        }
    }
}

export function mediaNames(media: AnimeSamaSearchMediaType) {
    return [[media?.title?.romaji, media?.title?.english], media?.synonyms].flat()
}

export function searchFriendlyMediaNames(media: AnimeSamaSearchMediaType) {
    return mediaNames(media).map(s => searchFriendly(s ?? ""))
}

export async function searchMedia(media: AnimeSamaSearchMediaType) {
    const { urlAppending, searchResultApplyTitle } = getFormatData(media)
    const searchResult = await searchTitles(media, searchResultApplyTitle)
    if (!searchResult) {
        return null
    }
    searchResult.result.url = searchResult.result.url.trim()
    if (searchResult.result.url[searchResult.result.url.length - 1] !== "/") {
        searchResult.result.url += "/"
    }
    searchResult.result.url += urlAppending(searchResult.data ?? undefined)
    return searchResult
}

export function searchFriendly(s: string) {
    return s.trim().replaceAll("-", "").toLowerCase()
}

export interface AnimeSamaSearch<T> {
    data?: T | undefined;
    result: SearchResult;
}