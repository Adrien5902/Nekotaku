import { type FuzzyDate, MediaListStatus, type Media, type MediaList } from "./Anilist/graphql";

export function autoUpdateMediaListByProgress(media: Pick<Media, "episodes">, mediaList: Pick<MediaList, "progress" | "startedAt" | "completedAt" | "status">): Partial<MediaList> {
    const hasWatchedAllEpisodes = mediaList?.progress === media?.episodes;

    const status = hasWatchedAllEpisodes ? MediaListStatus.Completed : mediaList?.progress !== 0 ? MediaListStatus.Current : mediaList.status
    const startedAt = !mediaList?.startedAt?.year ? currentFuzzyDate() : mediaList.startedAt;
    const completedAt = status === MediaListStatus.Completed && !mediaList?.completedAt?.year ? currentFuzzyDate() : mediaList?.completedAt

    return {
        ...mediaList,
        status,
        completedAt,
        startedAt,
    }
}

export function autoUpdateMediaListByStatus(mediaList: MediaList): MediaList {
    // TODO : see https://github.com/Adrien5902/Nekotaku/issues/29
    return {
        ...mediaList
    }
}

export function currentFuzzyDate(): FuzzyDate {
    const date = new Date(Date.now())
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
}