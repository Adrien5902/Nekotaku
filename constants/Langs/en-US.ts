import type { LangScheme } from "./scheme";

export const enUS: LangScheme = {
    Anilist: {
        MediaStatus: {
            CANCELLED: "Cancelled",
            FINISHED: "Finished",
            HIATUS: "Hiatus",
            NOT_YET_RELEASED: "Not Yet Released",
            RELEASING: "Releasing"
        },
        MediaFormat: {
            MANGA: "Manga",
            MOVIE: "Movie",
            MUSIC: "Music",
            NOVEL: "Novel",
            ONA: "ONA",
            ONE_SHOT: "One shot",
            OVA: "OVA",
            SPECIAL: "Special",
            TV: "TV",
            TV_SHORT: "TV Short"
        },
        MediaListStatus: {
            COMPLETED: "Completed",
            CURRENT: "Watching",
            DROPPED: "Dropped",
            PAUSED: "Paused",
            PLANNING: "Planning",
            REPEATING: "Repeating"
        },
        MediaType: {
            ANIME: "Anime",
            MANGA: "Manga"
        }
    },
    pages: {
        media: {
            details: {
                trailer: "Trailer",
                status: "Media Status",
                releaseDate: "Release Date",
                numberOfEpisodes: "Number Of Episodes",
                duration: "Episode Duration",
                season: "Season",
                source: "Source",
                origin: "Origin",
            }
        },
        downloadedEpisodes: {
            title: "Downloaded Episodes",
            noDownloadedEpisodes: "No downloaded episodes"
        },
        settings: {
            tilte: "Settings",
            account: {
                loggedInAs: "Logged in as",
                logout: "Logout"
            }
        }
    },
    settings: {
        colorTheme: "App color theme",
        themes: {
            dark: "Dark",
            light: "Light",
            system: "System"
        },
        defaultMode: "App default mode",
        offlineMode: "Offline Mode",
        lang: "App Lang",
        langs: {
            "en-US": "English US 🇺🇸",
            "fr-FR": "French France 🇫🇷"
        }
    }
}