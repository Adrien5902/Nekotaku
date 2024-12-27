import type { LangScheme } from "./scheme";

export const frFR: LangScheme = {
    Anilist: {
        MediaRelation: {
            ADAPTATION: "Adaptation",
            ALTERNATIVE: "Alternatif",
            CHARACTER: "Personnage",
            COMPILATION: "Compilation",
            CONTAINS: "Contient",
            OTHER: "Autre",
            PARENT: "Issu de",
            PREQUEL: "Précédent",
            SEQUEL: "Suivant",
            SIDE_STORY: "Histoire secondaire",
            SOURCE: "Source",
            SPIN_OFF: "Spin-off",
            SUMMARY: "Résumé"
        },
        MediaDuration: (hours, minutes) => `${hours ? `${hours}h` : ""} ${minutes} min`,
        MediaSeason: {
            FALL: "Automne",
            SPRING: "Printemps",
            SUMMER: "Été",
            WINTER: "Hiver"
        },
        MediaSource: {
            ANIME: "Animé",
            COMIC: "Comic",
            DOUJINSHI: "Doujinshi",
            GAME: "Jeu",
            LIGHT_NOVEL: "Nouvelle",
            LIVE_ACTION: "Live Action",
            MANGA: "Manga",
            MULTIMEDIA_PROJECT: "Projet Multimédia",
            NOVEL: "Roman",
            ORIGINAL: "Original",
            OTHER: "Autre",
            PICTURE_BOOK: "Livre imagé",
            VIDEO_GAME: "Jeu vidéo",
            VISUAL_NOVEL: "Visual Novel",
            WEB_NOVEL: "Web Novel"
        },
        countryOfOrigin: {
            CN: "Chine",
            JP: "Japon",
            KR: "Corée du sud",
            TW: "Taïwan"
        },
        MediaStatus: {
            CANCELLED: "Annulé",
            FINISHED: "Terminé",
            HIATUS: "Pause",
            NOT_YET_RELEASED: "Pas encore sorti",
            RELEASING: "En cours"
        },
        MediaFormat: {
            MANGA: "Manga",
            MOVIE: "Film",
            MUSIC: "Musique",
            NOVEL: "Roman",
            ONA: "OAN",
            ONE_SHOT: "One shot",
            OVA: "OAV",
            SPECIAL: "Épisode spécial",
            TV: "TV",
            TV_SHORT: "TV Court"
        },
        MediaListStatus: {
            COMPLETED: "Terminé",
            CURRENT: "En cours",
            DROPPED: "Abandonné",
            PAUSED: "En pause",
            PLANNING: "À regarder",
            REPEATING: "Re-regarde"
        },
        MediaType: {
            ANIME: "Animé",
            MANGA: "Manga"
        }
    },
    pages: {
        player: {
            settings: {
                playBackSpeed: "Playback speed",
                playBackSpeedMultiplier: (mul) => `x${mul}`,
                selectedLecteur: "Selected Lecteur"
            }
        },
        episodes: {
            episode: (n: number) => `Épisode ${n}`,
            loading: "Récupération des épisodes"
        },
        editMediaListStatus: {
            delete: "Supprimer",
            episodeProgress: "Progression des épisodes",
            favorite: "Favori",
            hidden: "Cachée sur ma liste",
            notesPlaceHolder: "Notes...",
            private: "Privé",
            save: "Enregistrer",
            score: "Score",
            totalRewatches: "Nombre de re-visionnages",
            deleteConfirm: "Supprimer de la liste ?"
        },
        media: {
            details: {
                trailer: "Trailer",
                status: "Status",
                releaseDate: "Date de sortie",
                numberOfEpisodes: "Nb. d'épisodes",
                duration: "Durée d'un ep.",
                season: "Saison",
                source: "Source",
                origin: "Origine",
            }
        },
        downloadedEpisodes: {
            noDownloadedEpisodes: "Aucun episode téléchargé",
            title: "Épisodes téléchargés"
        },
        settings: {
            account: {
                loggedInAs: "Connecté en tant que",
                logout: "Se déconnecter"
            },
            tilte: "Paramètres"
        }
    },
    settings: {
        colorTheme: "Thème",
        defaultMode: "Mode de l'appli par défaut",
        lang: "Langue",
        langs: {
            "en-US": "Anglais US 🇺🇸",
            "fr-FR": "Français France 🇫🇷"

        },
        offlineMode: "Mode hors-linge",
        themes: {
            dark: "Sombre",
            light: "Clair",
            system: "Système"
        }
    },
    misc: {
        searchPlaceholder: "Rechercher...",
        cancel: "Annuler",
        statusDisplay: {
            late: (episodes) => `${episodes} épisode${episodes > 1 ? "s" : ""} de retard`,
            nextEpIn: (shouldShowDays, days, hours, mins) => `Prochain épisode dans ${shouldShowDays
                ? `${days} jours`
                : `${hours}h ${mins}min`
                }`
        }
    }
}