export type AnimeSamaMediaType = "saison" | "oav" | "film"

export class AnimeSamaUrl {
    animeName: string;
    type: AnimeSamaMediaType;
    season?: number;
    horsSerie?: boolean;
    lang?: keyof typeof Lang;

    constructor(
        animeName: string,
        type: AnimeSamaMediaType,
        lang?: keyof typeof Lang,
        season?: number,
        horsSerie?: boolean,
    ) {
        this.animeName = animeName
        this.type = type;
        this.season = season ?? 1
        this.horsSerie = horsSerie
        this.lang = lang
    }

    makeURL() {
        return `https://anime-sama.fr/catalogue/${this.animeName}/${this.type}${this.season ? this.season : ""}${this.horsSerie ? "hs" : ""}/${this.lang ? this.lang.toLowerCase() : ""}`
    }

    static fromURL(url: string): AnimeSamaUrl | null {
        const regex = /https:\/\/anime-sama\.fr\/catalogue\/([a-z0-9-]+)(?:\/(oav|film|saison(\d+))?)?(?:\/(hs)?)?(?:\/([^\/]+)?)?\/?/;

        const match = url.match(regex);

        if (!match) return null;

        const animeName = match[1];
        const type = match[2].replace(/\d+/, "") as AnimeSamaMediaType;
        const seasonN = Number.parseInt(match[3], 10);
        const horsSerie = Boolean(match[4]);
        const lang = match[5]?.toUpperCase() as keyof typeof Lang;

        return new AnimeSamaUrl(animeName, type, lang, seasonN, horsSerie);
    }

    async getAvailableLangsAndEpisodes(): Promise<LangsAndEpisodes> {
        const urls = Object.keys(Lang).map((lang) => {
            const url = new AnimeSamaUrl(this.animeName, this.type, lang as keyof typeof Lang, this.season, this.horsSerie);
            url.lang = lang as keyof typeof Lang;
            return url;
        })

        let customEpisodes: {
            name: EpisodeName;
            id: EpisodeId;
        }[] | null = null;

        const langs = (await Promise.all(urls.map(async (url) => {
            const res = await fetch(url.makeURL());

            if (res.ok && !customEpisodes) {
                const html = await res.text()
                const regex = /<script>\s*\$\(document\)\.ready\(function\(\)\{\s*\/\*[\s\S]*\*\/([\s\S]*)\}\);\s*<\/script>/gm
                const customEpisodeStrConfig = html.matchAll(regex)?.next().value?.[1]
                customEpisodes = []
                if (customEpisodeStrConfig) {
                    const regex = /(newSP)F?\((("(.*)")|(\d+\.?\d*))\)|(creerListe)\(\s*(\d+)\s*,\s*(\d+)\s*\)|(finirListe)\((\d+)\)/g;
                    const customEpisodeConfigs = customEpisodeStrConfig.matchAll(regex);
                    for (const config of Array.from(customEpisodeConfigs)) {
                        const action = config[1] ?? config[6] ?? config[9]
                        switch (action) {
                            case "newSP": {
                                const SP = config[5] ? Number.parseFloat(config[5]) : config[4]
                                if (SP) {
                                    customEpisodes.push({ name: SP, id: customEpisodes.length })
                                }
                                break;
                            }
                            case "creerListe": {
                                const from = config[7] ? Number.parseInt(config[7]) : undefined;
                                const to = config[8] ? Number.parseInt(config[8]) : undefined;
                                if (from !== undefined && to !== undefined) {
                                    for (let i = from; i <= to; i++) {
                                        customEpisodes.push({ name: i, id: customEpisodes.length })
                                    }
                                }
                                break;
                            }
                            case "finirListe": {
                                const name = config[10] ? Number.parseInt(config[10]) : undefined;
                                if (name) {
                                    customEpisodes.push({ name, id: customEpisodes.length })
                                }
                                break;
                            }

                            default:
                                break;
                        }
                    }
                }
            }

            return {
                lang: url.lang as keyof typeof Lang, ok: res.ok
            }
        }))).filter(({ ok }) => ok).map(({ lang }) => lang)



        return { langs, customEpisodes: customEpisodes ?? undefined }
    }
}

export type Langs = (keyof typeof Lang)[]
export type CustomEpisodes = { name: EpisodeName, id: EpisodeId }[]
export interface LangsAndEpisodes { langs: Langs, customEpisodes?: CustomEpisodes };

export enum Lang {
    VOSTFR = "vostfr",
    VF = "vf",
    VJ = "vj",
    VCN = "vcn",
    VQC = "vqc",
    VKR = "vkr",
    VA = "va",
    VF1 = "vf1",
    VF2 = "vf2",
}

export interface Lecteur {
    id: number,
    hostname: string,
    url: string
}

export interface Episode {
    name: EpisodeName,
    id: EpisodeId
    lecteurs: Lecteur[]
}

export type EpisodeId = number;
export type EpisodeName = string | number;