import type { SupportedLecteurs } from "@/hooks/useGetVideoSource"
import { MediaType } from "@/types/Anilist/graphql"

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