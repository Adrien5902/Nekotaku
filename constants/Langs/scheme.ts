import type { ColorTheme, Lang } from "@/components/Settings/types"
import type { MediaFormat, MediaListStatus, MediaRelation, MediaSeason, MediaSource, MediaStatus, MediaType } from "@/types/Anilist/graphql"
import type { EpisodeName } from "@/types/AnimeSama";
import type { AndroidChannel, AndroidChannelGroup } from "@notifee/react-native"

export enum CountryOfOrigin {
    Japan = "JP",
    SouthKorea = "KR",
    China = "CN",
    Taiwan = "TW",
}

export type NotificationChannelLangScheme = Pick<AndroidChannel, "name" | "description">;
export type NotificationChannelGroupLangScheme = Pick<AndroidChannelGroup, "name" | "description">

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
        tabBar: {
            list: (type: MediaType) => string
            explore: string
            me: string
        }
        player: {
            settings: {
                playBackSpeed: string
                playBackSpeedMultiplier: (multiplier: number | string) => string
                selectedLecteur: string
            }
        }
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
            update: {
                downloading: string
                downloadLatest: (version?: string) => string
                checkAvailability: string
                checking: string
                noneAvailable: string
            }
        },
        media: {
            details: {
                description: string;
                status: string,
                releaseDate: string,
                unknownReleaseDate: string,
                numberOfEpisodes: string,
                duration: string,
                season: string,
                source: string,
                origin: string,
                trailer: string
                synonyms: string
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
        preferredLecteur: string
        appVersion: (version: string) => string
    }

    notifications: {
        downloads: {
            channelGroup: NotificationChannelGroupLangScheme
            progress: {
                channel: NotificationChannelLangScheme
                title: string
                body: (mediaTitle: string, episodeName: EpisodeName) => string
                actions: {
                    cancel: string
                    resume: string
                    pause: string
                }
            },
            completed: {
                title: string
                channel: NotificationChannelLangScheme
            }
        }
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