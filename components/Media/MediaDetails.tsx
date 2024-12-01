import type { Media, MediaTitle, MediaTrailer } from "@/types/Anilist/graphql";
import useStyles from "@/hooks/useStyles";
import MediaStats, { type Props as MediaStatsProps } from "./MediaStats";
import { Dimensions, Image, Linking, ScrollView, View } from "react-native";
import WebView from "react-native-webview";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, TextSizes } from "@/constants/Sizes";
import { ThemedText } from "../ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../Icon";
import { Link } from "expo-router";

export default function MediaDetails({
	media,
}: {
	media?:
		| (Pick<Media, "description"> &
				MediaStatsProps["media"] & {
					trailer?:
						| Pick<MediaTrailer, "site" | "id" | "thumbnail">
						| null
						| undefined;
					title?: Pick<MediaTitle, "english"> | null | undefined;
				})
		| null
		| undefined;
}) {
	const colors = useThemeColors();
	const styles = useStyles();
	const style = `<style>body{background: ${colors.background}; color: ${colors.text}; font-size: 40;}</style>`;

	return (
		<ScrollView style={{ flex: 1 }}>
			<View
				style={[
					styles.PrimaryElement,
					{ height: Dimensions.get("window").height / 4 },
				]}
			>
				<WebView
					source={{ html: style + (media?.description ?? "") }}
					style={{ backgroundColor: colors.background }}
				/>
			</View>

			<MediaStats media={media} />

			{media?.trailer?.thumbnail && media.trailer.site === "youtube" ? (
				<View
					style={[
						styles.PrimaryElement,
						{ padding: 0, justifyContent: "center" },
					]}
					onTouchEnd={() => {
						Linking.openURL(`https://youtube.com/watch?v=${media.trailer?.id}`);
					}}
				>
					<Image
						source={{ uri: media.trailer.thumbnail }}
						style={{ width: "100%", aspectRatio: 16 / 9 }}
					/>

					<LinearGradient
						colors={["#000000ff", "#00000000"]}
						style={{
							position: "absolute",
							width: "100%",
							height: Spacing.xl * 2,
							top: 0,
						}}
					/>

					<Icon
						name="arrow-up-right-from-square"
						style={{ position: "absolute" }}
						size={TextSizes.xxl}
					/>

					<ThemedText
						style={{ position: "absolute", top: Spacing.m, left: Spacing.m }}
					>
						{media.title?.english} - Trailer
					</ThemedText>
				</View>
			) : null}
		</ScrollView>
	);
}
