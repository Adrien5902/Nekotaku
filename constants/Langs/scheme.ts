import type { ColorTheme, Lang } from "@/components/Settings/types"
import type { MediaFormat, MediaListStatus, MediaRelation, MediaSeason, MediaSource, MediaStatus, MediaType } from "@/types/Anilist/graphql"

export enum CountryOfOrigin {
    Japan = "JP",
    SouthKorea = "KR",
    China = "CN",
    Taiwan = "TW",
}

export interface LangScheme {
    Anilist: {
        MediaRelation: {
            [key in MediaRelation]: string
        }
        MediaDuration: (hours: number, minutes: number) => string
        MediaSeason: {
            [key in MediaSeason]: string
        }
        MediaSource: {
            [key in MediaSource]: string
        }
        countryOfOrigin: {
            [key in CountryOfOrigin]: string
        }
        MediaStatus: {
            [key in MediaStatus]: string
        }
        MediaListStatus: {
            [key in MediaListStatus]: string
        }
        MediaFormat: {
            [key in MediaFormat]: string
        }
        MediaType: {
            [key in MediaType]: string
        }
    }

    pages: {
        episodes: {
            episode: (n: number) => string,
            loading: string
        }
        editMediaListStatus: {
            save: string
            notesPlaceHolder: string
            private: string
            hidden: string
            totalRewatches: string
            favorite: string
            score: string
            episodeProgress: string
            delete: string,
            deleteConfirm: string
        }
        downloadedEpisodes: {
            title: string,
            noDownloadedEpisodes: string
        },
        settings: {
            tilte: string
            account: {
                loggedInAs: string,
                logout: string
            }
        },
        media: {
            details: {
                status: string,
                releaseDate: string,
                numberOfEpisodes: string,
                duration: string,
                season: string,
                source: string,
                origin: string,
                trailer: string
            }
        }
    },

    settings: {
        lang: string,
        langs: { [key in Lang]: string }
        themes: { [key in ColorTheme]: string }
        offlineMode: string
        defaultMode: string,
        colorTheme: string
    }

    misc: {
        searchPlaceholder: string
        cancel: string
        statusDisplay: {
            nextEpIn: (shouldShowDays: boolean, days: number, hours: number, mins: number) => string
            late: (episodes: number) => string
        }
    }
}