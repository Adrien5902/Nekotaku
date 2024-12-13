import type { LangScheme } from "./scheme";

export const frFR: LangScheme = {
    Anilist: {
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
    }
}