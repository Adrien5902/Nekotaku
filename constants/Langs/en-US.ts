import type { LangScheme } from "./scheme";

export const enUS: LangScheme = {
    Anilist: {
        MediaDuration: (hours, minutes) => `${hours ? `${hours}h` : ""} ${minutes} min`,
        MediaSeason: {
            FALL: "Fall",
            SPRING: "Spring",
            SUMMER: "Summer",
            WINTER: "Winter"
        },
        MediaSource: {
            ANIME: "Anime",
            COMIC: "Comic",
            DOUJINSHI: "Doujinshi",
            GAME: "Game",
            LIGHT_NOVEL: "Light Novel",
            LIVE_ACTION: "Live Action",
            MANGA: "Manga",
            MULTIMEDIA_PROJECT: "Multimedia Project",
            NOVEL: "Novel",
            ORIGINAL: "Original",
            OTHER: "Other",
            PICTURE_BOOK: "Picture Book",
            VIDEO_GAME: "Video Game",
            VISUAL_NOVEL: "Visual Novel",
            WEB_NOVEL: "Web Novel"
        },
        countryOfOrigin: {
            CN: "China",
            JP: "Japan",
            KR: "South Korea",
            TW: "Taiwan"
        },
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
            REPEATING: "Re-watching"
        },
        MediaType: {
            ANIME: "Anime",
            MANGA: "Manga"
        }
    },
    pages: {
        editMediaListStatus: {
            delete: "Delete",
            episodeProgress: "Episode progress",
            favorite: "Favorite",
            notesPlaceHolder: "Notes...",
            private: "Private",
            save: "Save",
            score: "Score",
            totalRewatches: "Total Rewatches",
            hidden: "Hidden from status list",
            deleteConfirm: "Delete anime/manga status ?"
        },
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
    },
    misc: {
        cancel: "Cancel",
        statusDisplay: {
            nextEpIn: (shouldShowDays, days, hours, mins) => `Next episode in ${shouldShowDays
                ? `${days} days`
                : `${hours}h ${mins}min`
                }`,
            late: (episodes) => `${episodes} episode${episodes > 1 ? "s" : ""} behind`,
        }
    }
}