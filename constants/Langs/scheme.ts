import type { ColorTheme, Lang } from "@/components/Settings/types"
import type { MediaFormat, MediaListStatus, MediaStatus, MediaType } from "@/types/Anilist/graphql"

export interface LangScheme {
    Anilist: {
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
}