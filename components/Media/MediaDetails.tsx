import type { Media, MediaTrailer } from "@/types/Anilist/graphql";
import useStyles from "@/hooks/useStyles";
import MediaStats, { type Props as MediaStatsProps } from "./MediaStats";
import { Dimensions, ScrollView, View } from "react-native";
import WebView from "react-native-webview";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing } from "@/constants/Sizes";

export default function MediaDetails({
	media,
}: {
	media?:
		| (Pick<Media, "description"> &
				MediaStatsProps["media"] & {
					trailer?: Pick<MediaTrailer, "site" | "id"> | null | undefined;
				})
		| null
		| undefined;
}) {
	const colors = useThemeColors();
	const styles = useStyles();
	const style = `<style>body{background: ${colors.background}; color: ${colors.text}; font-size: 40;}</style>`;

	let iframe: string | undefined = undefined;
	if (media?.trailer?.id && media?.trailer?.site === "youtube") {
		iframe = `<iframe src="https://www.youtube.com/embed/${media.trailer.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
	}

	return (
		<ScrollView style={{ flex: 1 }}>
			<View
				style={[
					styles.PrimaryElement,
					{ height: Dimensions.get("window").height / 4 },
				]}
			>
				<WebView source={{ html: style + (media?.description ?? "") }} />
			</View>

			<MediaStats media={media} />

			{iframe ? (
				<View
					style={[styles.PrimaryElement, { margin: Spacing.l, padding: 0 }]}
				>
					<WebView
						style={{ width: "100%", aspectRatio: 16 / 9 }}
						source={{ html: style + iframe }}
						injectedJavaScript="let iframe = document.querySelector('iframe'); iframe.width = window.innerWidth; iframe.height = window.innerHeight;"
					/>
				</View>
			) : null}
		</ScrollView>
	);
}
