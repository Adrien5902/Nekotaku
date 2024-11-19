import type { Media } from "@/types/Anilist/graphql";
import useStyles from "@/hooks/useStyles";
import MediaStats, { type Props as MediaStatsProps } from "./MediaStats";
import { Dimensions, ScrollView, View } from "react-native";
import WebView from "react-native-webview";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function MediaDetails({
	media,
}: {
	media?:
		| (Pick<Media, "description"> & MediaStatsProps["media"])
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
				<WebView source={{ html: style + (media?.description ?? "") }} />
			</View>

			<MediaStats media={media} />
		</ScrollView>
	);
}
