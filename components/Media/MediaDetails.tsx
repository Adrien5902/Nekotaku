import type {
	FuzzyDate,
	Media,
	MediaTitle,
	MediaTrailer,
} from "@/types/Anilist/graphql";
import useStyles from "@/hooks/useStyles";
import MediaStats, { type Props as MediaStatsProps } from "./MediaStats";
import {
	Dimensions,
	Image,
	Linking,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import WebView from "react-native-webview";
import { useThemeColors } from "@/hooks/useThemeColor";
import { AspectRatios, Spacing, TextSizes } from "@/constants/Sizes";
import { ThemedText } from "../ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../Icon";
import useLang from "@/hooks/useLang";
import type { CountryOfOrigin } from "@/constants/Langs/scheme";
import type { Lang } from "../Settings/types";
import { useSettings } from "../Settings/Context";

export default function MediaDetails({
	media,
}: {
	media?:
		| (Pick<
				Media,
				| "description"
				| "startDate"
				| "endDate"
				| "status"
				| "episodes"
				| "duration"
				| "season"
				| "source"
				| "countryOfOrigin"
				| "seasonYear"
		  > &
				MediaStatsProps["media"] & {
					trailer?:
						| Pick<MediaTrailer, "site" | "id" | "thumbnail">
						| null
						| undefined;
					title?: Pick<MediaTitle, "english" | "romaji"> | null | undefined;
				})
		| null
		| undefined;
}) {
	const colors = useThemeColors();
	const styles = useStyles();
	const style = `<style>body{background: ${colors.background}; color: ${colors.text}; font-size: 40;}</style>`;
	const duration = media?.duration ?? 0;
	const hours = Math.floor(duration / 60);
	const lang = useLang();
	const settings = useSettings();

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

			<DetailsTable
				lines={[
					{
						label: lang.pages.media.details.status,
						text: media?.status ? lang.Anilist.MediaStatus[media?.status] : "",
					},
					{
						label: lang.pages.media.details.releaseDate,
						text: `${dateStrFromFuzzyDate(media?.startDate, settings.lang)} - ${dateStrFromFuzzyDate(media?.endDate, settings.lang)}`,
					},
					{
						label: lang.pages.media.details.numberOfEpisodes,
						text: (media?.episodes ?? 0).toString(),
					},
					{
						label: lang.pages.media.details.duration,
						text: lang.Anilist.MediaDuration(hours, duration % 60),
					},
					{
						label: lang.pages.media.details.season,
						text: media?.season
							? `${lang.Anilist.MediaSeason[media?.season]} ${media?.seasonYear}`
							: "",
					},
					{
						label: lang.pages.media.details.source,
						text: media?.source ? lang.Anilist.MediaSource[media?.source] : "",
					},
					{
						label: lang.pages.media.details.origin,
						text: lang.Anilist.countryOfOrigin[
							(media?.countryOfOrigin ?? "JP") as CountryOfOrigin
						],
					},
				]}
			/>

			{media?.trailer?.thumbnail && media.trailer.site === "youtube" ? (
				<TouchableOpacity
					onPress={() => {
						Linking.openURL(`https://youtube.com/watch?v=${media.trailer?.id}`);
					}}
				>
					<View
						style={[
							styles.PrimaryElement,
							{ padding: 0, justifyContent: "center" },
						]}
					>
						<Image
							source={{ uri: media.trailer.thumbnail }}
							style={{
								width: "100%",
								aspectRatio: AspectRatios.screenHorizontal,
							}}
						/>

						<LinearGradient
							colors={["#000000ff", "#00000000"]}
							style={{
								position: "absolute",
								width: "100%",
								height: Spacing.xxl,
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
							{media.title?.english ?? media.title?.romaji} -{" "}
							{lang.pages.media.details.trailer}
						</ThemedText>
					</View>
				</TouchableOpacity>
			) : null}
		</ScrollView>
	);
}

function dateStrFromFuzzyDate(
	date: FuzzyDate | null | undefined,
	langId: Lang,
) {
	const datetime = new Date(
		date?.year ?? 0,
		(date?.month ?? 1) - 1,
		date?.day ?? 1,
	);

	return datetime.toLocaleDateString(langId, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function DetailsTable({
	lines,
}: { lines: { label: string; text: JSX.Element | string }[] }) {
	const styles = useStyles();
	const colors = useThemeColors();

	return (
		<View
			style={[
				styles.PrimaryElement,
				{ flexDirection: "column", alignItems: "stretch", padding: 0 },
			]}
		>
			{lines.map(({ label, text }, i) => (
				<View
					key={label}
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						flex: 1,
						borderColor: colors.primary,
						// Do not show border on the first item
						borderTopWidth: i && Spacing.xs,
						padding: Spacing.m,
					}}
				>
					<ThemedText weight="bold">{label}</ThemedText>
					{typeof text === "string" ? (
						<ThemedText weight="bold">{text}</ThemedText>
					) : (
						text
					)}
				</View>
			))}
		</View>
	);
}
