export interface Settings {
    colorTheme: keyof typeof ColorTheme
    lang: keyof typeof Lang
    offlineMode: boolean
}

export const DefaultSettings: Settings = {
    colorTheme: "system",
    lang: "fr",
    offlineMode: false,
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