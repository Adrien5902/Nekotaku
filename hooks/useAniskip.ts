import type { Episode } from "@/types/AnimeSama";
import type { Media } from "@/types/Anilist/graphql";
import { useCachedPromise } from "./usePromise";
import { CacheReadType } from "./useCache";

export default function useAniskip(media: Pick<Media, "id" | "idMal"> | undefined | null, durationMillis: number | undefined, episode: Episode) {
    return useCachedPromise(
        CacheReadType.MemoryAndIfNotDisk,
        "aniskip",
        async () => {
            if (
                media?.idMal &&
                durationMillis &&
                durationMillis > 1 &&
                (typeof episode.name === "number" ||
                    !Number.isNaN(Number.parseInt(episode.name)))
            ) {
                const url = `https://api.aniskip.com/v2/skip-times/${media.idMal}/${episode.name}?types=op&types=ed&episodeLength=${durationMillis / 1000}`;
                const res = await fetch(url, {
                    headers: { Accept: "application/json" },
                });
                const json: AniskipData = await res.json();

                if (!json.found) {
                    return null
                }

                return json.results
            }
        },
        [media?.id ?? 0, episode.id, durationMillis],
    );
}

export interface AniskipData {
    "statusCode": number,
    "message": "string",
    "found": boolean,
    "results": [
        {
            "interval": {
                "startTime": number,
                "endTime": number
            },
            "skipType": "op" | "ed",
            "skipId": string,
            "episodeLength": number
        }
    ]
}