import { supportedLecteurs, type SupportedLecteurs } from "@/hooks/useGetVideoSource"
import { MediaType } from "@/types/Anilist/graphql"
import type { Episode } from "@/types/AnimeSama"

export interface Settings {
    colorTheme: ColorTheme
    lang: Lang
    offlineMode: boolean
    defaultMode: MediaType
    preferredLecteur: SupportedLecteurs
}

export enum ColorTheme {
    System = "system",
    Light = "light",
    Dark = "dark"
}

export enum Lang {
    Français = "fr-FR",
    English = "en-US"
}

export const DefaultSettings: Settings = {
    colorTheme: ColorTheme.System,
    lang: Lang.Français,
    offlineMode: false,
    defaultMode: MediaType.Anime,
    preferredLecteur: "sendvid.com"
}

export function getPreferredLecteur(episode: Episode, settings: Settings) {
    const supportedLecteursForEpisode = episode?.lecteurs.filter((l) =>
        Object.keys(supportedLecteurs).find((l2) => l.hostname.includes(l2)),
    );

    return supportedLecteursForEpisode.find(l => l.hostname.includes(settings.preferredLecteur)) ?? supportedLecteursForEpisode[0]
}