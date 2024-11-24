import type { Episode } from "@/types/AnimeSama";
import DiskCache from "./useDiskCache";
import type { Media } from "@/types/Anilist/graphql";

export default function useAniskip(media: Pick<Media, "id" | "idMal">, durationMillis: number | undefined, episode: Episode) {
    return DiskCache.useWithMemory(
        "aniskip",
        async () => {
            if (
                durationMillis &&
                durationMillis > 1 &&
                (typeof episode.name === "number" ||
                    !Number.isNaN(Number.parseInt(episode.name)))
            ) {
                const url = `https://api.aniskip.com/v2/skip-times/${media.idMal}/${episode.name}?types=op&types=ed&episodeLength=${durationMillis / 1000}`;
                const res = await fetch(url, {
                    headers: { Accept: "application/json" },
                });
                const json: Res = await res.json();

                if (!json.found) {
                    return null
                }

                return json.results
            }
        },
        [media.id, episode.id, durationMillis],
    );
}

interface Res {
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