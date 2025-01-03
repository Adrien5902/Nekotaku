import type { LangScheme } from "./scheme";

export const enUS: LangScheme = {
    Anilist: {
        MediaRelation: {
            ADAPTATION: "Adaptation",
            ALTERNATIVE: "Alternative",
            CHARACTER: "Character",
            COMPILATION: "Compilation",
            CONTAINS: "Contains",
            OTHER: "Other",
            PARENT: "Parent",
            PREQUEL: "Prequel",
            SEQUEL: "Sequel",
            SIDE_STORY: "Side Story",
            SOURCE: "Source",
            SPIN_OFF: "Spin Off",
            SUMMARY: "Summary"
        },
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
        tabBar: {
            list: (type) => `${enUS.Anilist.MediaType[type]} List`,
            explore: "Explore",
            me: "Me"
        },
        player: {
            remoteMediaCast: {
                connectionState: {
                    CantConnect: "Can't Connect",
                    Connected: "Connected",
                    Connecting: "Connecting...",
                    NotConnected: "NotConnected"
                },
                connectPrompt: "Connect ?",
                title: "Select a device to cast on",
                cancel: "Cancel"
            },
            settings: {
                close: "Close",
                playBackSpeed: "Playback speed",
                playBackSpeedMultiplier: (mul) => `x${mul}`,
                selectedLecteur: "Selected Lecteur"
            }
        },
        episodes: {
            deleteDownloadedConfirm: {
                cancel: "Cancel",
                confirm: "Delete",
                title: "Delete downloaded episode ?",
            },
            episode: (n: number) => `Episode ${n}`,
            loading: "Retrieving episodes..."
        },
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
                description: "Description",
                trailer: "Trailer",
                status: "Media Status",
                releaseDate: "Release Date",
                unknownReleaseDate: "Unknown",
                numberOfEpisodes: "Number Of Episodes",
                duration: "Episode Duration",
                season: "Season",
                source: "Source",
                origin: "Origin",
                synonyms: "Synonyms",
            },
            relations: {
                noRelations: "No relations"
            }
        },
        downloadedEpisodes: {
            title: "Downloaded Episodes",
            noDownloadedEpisodes: "No downloaded episodes"
        },
        settings: {
            update: {
                downloading: "Downloading update...",
                downloadLatest: (version) => `Download latest ${version ? `(${version})` : ""}`,
                checkAvailability: "Check for updates",
                checking: "Checking for updates...",
                noneAvailable: "No update available"
            },
            tilte: "Settings",
            account: {
                loggedInAs: "Logged in as",
                logout: "Logout"
            }
        }
    },
    settings: {
        appVersion: (v) => `App version : ${v}`,
        preferredLecteur: "Preferred Lecteur : ",
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
    notifications: {
        downloads: {
            channelGroup: {
                name: "Downloads",
                description: "Episodes downloads"
            },
            completed: {
                channel: {
                    name: "Downloading Episodes Status",
                    description: "Progress bar notification for episode downloading status",
                },
                title: "✅ Finished downloading episode"
            },
            progress: {
                actions: { cancel: "Cancel", pause: "Pause", resume: "Resume" },
                body: (mediaTitle, episodeName) => `${mediaTitle} - ${typeof episodeName === "number" ? `Ep. ${episodeName}` : episodeName}`,
                channel: {
                    name: "Finished Downloading episode",
                    description:
                        "Notification when an episode has finished downloading",
                },
                title: "Downloading"
            }
        }
    },

    misc: {
        searchPlaceholder: "Search...",
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