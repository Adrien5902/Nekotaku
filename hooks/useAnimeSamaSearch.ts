import { type MediaFormat, MediaRelation, MediaStatus, type Media, type MediaTitle } from "@/types/Anilist/graphql";
import { DOMParser } from 'react-native-html-parser';
import { CacheReadType } from "./useCache";
import { useCachedPromise } from "./usePromise";
import { distance } from 'fastest-levenshtein';
import { gql } from "@/types/Anilist";
import { type ApolloClient, useApolloClient } from "@apollo/client";

interface SeasonData {
    season: number;
    part: number | null;
}

export type AnimeSamaSearchMediaType = Pick<Media, "id" | "synonyms" | "format" | "status"> & {
    title?: Pick<MediaTitle, "english" | "romaji"> | null | undefined
} | null | undefined

export function useAnimeSamaSearch(media?: AnimeSamaSearchMediaType) {
    const apolloClient = useApolloClient()
    return useCachedPromise(CacheReadType.MemoryAndIfNotDisk, "animeSamaSearch", async () => {
        if (!media) {
            return undefined
        }

        if (media.status === MediaStatus.Cancelled || media.status === MediaStatus.NotYetReleased) {
            throw new Error("Media not yet released")
        }

        const searchRes = await searchMedia(media, apolloClient)
        if (!searchRes) {
            throw new Error("Anime not found on AnimeSama")
        }
        return searchRes
    }, [media?.id ?? 0])
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

export interface AnimeSamaSearchResult {
    title: string,
    subtitles: string[],
    url: string,
}

export function parseSearchResultFromHTML(html: string): AnimeSamaSearchResult[] {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    const links = document.getElementsByTagName('a');

    const results: AnimeSamaSearchResult[] = [];
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

export async function searchBestMatch(query: string) {
    const search_friendly_query = query;
    const results = await search(search_friendly_query);
    const result = results.reduce((prev, curr) => {
        const title_dist = distance(searchFriendly(curr.title), search_friendly_query);
        const subtitles_dist = curr.subtitles.map(subtitle => distance(searchFriendly(subtitle), search_friendly_query))

        const smallest_dist = Math.min(title_dist, ...subtitles_dist);

        if (prev?.[1] !== undefined && prev[1] < smallest_dist) {
            return prev
        }

        return [curr, smallest_dist] as [AnimeSamaSearchResult, number]

    }, null as [AnimeSamaSearchResult, number] | null)
    return result?.[0]
}

function getSeasonFromString(s: string) {
    const seasonDigitRegex = /season (\d+)/gim;
    const seasonDigitThRegex = /(\d+)(?:st|nd|rd|th) season/gim;
    const seasonEndOfStrDigitRegex = / (\b\d)$/gim
    const seasonNameRegex = /(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth) season/gim;

    const partRegex = /part (\d+)/gim
    const partMatch = s.matchAll(partRegex).next().value;
    let newTitle = s;
    let part: number | null = null;
    if (partMatch) {
        newTitle = s.replace(partMatch[0], "")
        part = partMatch ? Number.parseInt(partMatch[1]) : null
    }

    for (const regex of [seasonDigitRegex, seasonDigitThRegex, seasonEndOfStrDigitRegex]) {
        const match = newTitle.matchAll(regex).next().value
        if (match) {
            return { newTitle: newTitle.replace(match[0], ""), data: { season: Number.parseInt(match[1]), part } }
        }
    }

    const seasonNameMatch = newTitle.matchAll(seasonNameRegex).next().value
    if (seasonNameMatch) {
        const season = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"].indexOf(seasonNameMatch[1]) + 1;
        return { newTitle: newTitle.replace(seasonNameMatch[0], ""), data: { part, season } }
    }

    return { newTitle, data: { season: 1, part } }
}

type FormatData = {
    appendToUrl: string
    newTitles: string[]
};

function getFormatData(mediaFormat: MediaFormat | undefined, searchFriendlyMediaNames: string[]): FormatData {
    const titlesSeasonData = searchFriendlyMediaNames.map(s => getSeasonFromString(s))
    const seasonData = titlesSeasonData.find(s => !!s)?.data
    const newTitles = titlesSeasonData.map(t => searchFriendly(t.newTitle))

    let appendToUrl: string;

    switch (mediaFormat) {
        case "MOVIE":
            appendToUrl = "film";
            break;

        case "OVA":
            appendToUrl = "oav";
            break;

        case "MANGA":
            appendToUrl = "scan";
            break;

        default: {
            appendToUrl = seasonData?.season ? `saison${seasonData.season}` : "saison1"
        }
    }

    return { appendToUrl, newTitles }
}

async function searchTitles(searchFriendlyMediaNames: string[]): Promise<AnimeSamaSearchResult | undefined> {
    for (const synonym of searchFriendlyMediaNames) {
        const result = await searchBestMatch(synonym)
        if (result) {
            return result
        }
    }
}

export function mediaNames(media: AnimeSamaSearchMediaType) {
    return [[media?.title?.english ?? undefined, media?.title?.english?.split(":")[0] ?? undefined, media?.title?.romaji ?? undefined], media?.synonyms ?? []]
        .flat()
        .filter(s => s !== undefined && s !== null)
}

export function searchFriendlyMediaNames(media: AnimeSamaSearchMediaType) {
    return mediaNames(media).map(s => searchFriendly(s))
}

export async function searchMedia(media: AnimeSamaSearchMediaType, apolloClient: ApolloClient<object>, recursiveAppendToUrl?: FormatData["appendToUrl"]): Promise<AnimeSamaSearchResult | null> {
    const searchFriendlyNames = searchFriendlyMediaNames(media)
    const formatData = getFormatData(media?.format ?? undefined, searchFriendlyNames)
    const appendToUrl = recursiveAppendToUrl ?? formatData.appendToUrl

    const searchResult = await searchTitles(formatData.newTitles)

    if (!searchResult) {
        if (!media?.id) return null

        const relations = await fetchRelations(media.id, apolloClient)
        const prequels = relations?.filter(relation => relation?.relationType === MediaRelation.Prequel).map(r => r?.node)
        return prequels?.map(async (prequel) => await searchMedia(prequel, apolloClient, appendToUrl)).find(result => !!result) ?? null
    }

    searchResult.url = searchResult.url.trim()
    if (searchResult.url[searchResult.url.length - 1] !== "/") {
        searchResult.url += "/"
    }
    searchResult.url += appendToUrl

    return searchResult
}

export function searchFriendly(s?: string) {
    return s?.trim().replaceAll("-", " ").toLowerCase() ?? ""
}

export interface AnimeSamaSearch<T> {
    data?: T | undefined;
    result: AnimeSamaSearchResult;
}

const RELATIONS_QUERY = gql(`
    query Relations($mediaId: Int) {
        Media(id: $mediaId) {
            relations {
                edges {
                    node {
                    id
                    synonyms
                    format
                    status
                        title {
                            english
                            romaji
                        }
                    }
                    relationType
                }
            }
        }
    }
`)

async function fetchRelations(mediaId: number, apolloClient: ApolloClient<object>) {
    const result = await apolloClient.query({ query: RELATIONS_QUERY, variables: { mediaId } })

    if (result.error) {
        throw result.error
    }

    return result.data.Media?.relations?.edges
}