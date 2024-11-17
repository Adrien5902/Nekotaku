export interface Settings {
    colorTheme: keyof typeof ColorTheme
    lang: keyof typeof Lang
}

export const DefaultSettings: Settings = {
    colorTheme: "system",
    lang: "fr"
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