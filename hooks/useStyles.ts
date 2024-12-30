import { Dimensions, StyleSheet } from "react-native"
import { AspectRatios, Spacing } from "../constants/Sizes"
import { useThemeColors } from "./useThemeColor"

export function useStyles() {
    const colors = useThemeColors()
    const { width, height } = Dimensions.get("window")
    const Styles = StyleSheet.create({
        PrimaryElement: {
            color: colors.text,
            padding: Spacing.m,
            flexDirection: "row",
            margin: Spacing.s,
            marginHorizontal: Spacing.m,
            borderRadius: Spacing.s,
            overflow: "hidden",
            borderColor: colors.primary,
            borderWidth: Spacing.xs,
            alignItems: "center",
            justifyContent: "space-between"
        },

        topTextDescriptor: {
            position: "absolute",
            paddingHorizontal: Spacing.m,
            backgroundColor: colors.primary,
            top: -Spacing.m,
            left: Spacing.m,
        },

        fullscreenContainer: {
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: "#000",
        },
        video: {
            width: "100%",
            aspectRatio: AspectRatios.screenHorizontal,
        },
        fullscreenVideo: {
            width: "100%",
            height: "100%",
        },
    })
    return Styles
}

export default useStyles