import { useSettings } from "@/components/Settings/Context"
import { Lang } from "@/components/Settings/types"
import { enUS } from "@/constants/Langs/en-US";
import { frFR } from "@/constants/Langs/fr-FR";

export default function useLang() {
    const { lang } = useSettings()

    return getTranslationByLang(lang)
}

export function getTranslationByLang(lang: Lang) {
    switch (lang) {
        case Lang.English:
            return enUS

        case Lang.Français:
            return frFR

        default:
            return enUS
    }
}