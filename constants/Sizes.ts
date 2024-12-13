export const TextSizes = {
    xs: 10,

    s: 14,
    m: 18,
    l: 28,
    xl: 32,
    xxl: 48,
}
export type TextSize = keyof typeof TextSizes;

export const Spacing = {
    xs: 2,
    s: 4,
    m: 10,
    l: 18,
    xl: 32,
    xxl: 64,
}

export const AspectRatios = {
    banner: 14 / 3,
    cover: 3 / 4,
    screenHorizontal: 16 / 9,
    screenVertical: 9 / 16,
}