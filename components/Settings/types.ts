import { MediaType } from "@/types/Anilist/graphql"

export interface Settings {
    colorTheme: keyof typeof ColorTheme
    lang: keyof typeof Lang
    offlineMode: boolean
    defaultMode: MediaType
}

export const DefaultSettings: Settings = {
    colorTheme: "system",
    lang: "fr",
    offlineMode: false,
    defaultMode: MediaType.Anime
}

export enum ColorTheme {
    system = "system",
    light = "light",
    dark = "dark"
}

export enum Lang {
    fr = "Français",
    en = "English"
}