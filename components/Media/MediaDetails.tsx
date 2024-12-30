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
	TouchableHighlight,
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
import { useState } from "react";

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
				| "synonyms"
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
	const defaultDescriptionHeight = Dimensions.get("window").height / 10;
	const [descriptionHeight, setDescriptionHeight] = useState(
		defaultDescriptionHeight,
	);
	const [documentHeight, setDocumentHeight] = useState(
		defaultDescriptionHeight,
	);

	return (
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{ paddingVertical: Spacing.m }}
		>
			{media?.description ? (
				<TouchableHighlight
					onPress={() => {
						setDescriptionHeight((d) =>
							d === defaultDescriptionHeight
								? documentHeight + Spacing.m
								: defaultDescriptionHeight,
						);
					}}
				>
					<View
						style={[
							styles.PrimaryElement,
							{
								overflow: "visible",
								height: descriptionHeight,
							},
						]}
					>
						<ThemedText
							weight="bold"
							style={[
								styles.topTextDescriptor,
								{ backgroundColor: colors.background },
							]}
						>
							{lang.pages.media.details.description}
						</ThemedText>
						<WebView
							injectedJavaScript={
								"window.location.hash = 1; document.title = document.body.offsetHeight * 0.45;"
							}
							automaticallyAdjustContentInsets={false}
							scrollEnabled={false}
							source={{ html: style + media.description }}
							style={{ backgroundColor: colors.background }}
							onNavigationStateChange={(navState) => {
								console.log(navState.title);
								setDocumentHeight(Number.parseFloat(navState.title));
							}}
						/>
					</View>
				</TouchableHighlight>
			) : null}

			<MediaStats media={media} />

			<DetailsTable
				lines={[
					{
						label: lang.pages.media.details.status,
						text: media?.status ? lang.Anilist.MediaStatus[media?.status] : "",
					},
					{
						label: lang.pages.media.details.releaseDate,
						text: media?.startDate?.year
							? `${dateStrFromFuzzyDate(media?.startDate, settings.lang)}${media?.endDate?.year ? ` - ${dateStrFromFuzzyDate(media?.endDate, settings.lang)}` : ""}`
							: lang.pages.media.details.unknownReleaseDate,
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

			{media?.synonyms?.length ? (
				<View>
					<ThemedText
						weight="bold"
						style={{ paddingHorizontal: Spacing.l, marginTop: Spacing.m }}
					>
						{lang.pages.media.details.synonyms} :
					</ThemedText>
					<DetailsTable
						lines={media.synonyms
							.filter((s) => s !== null)
							.map((synonym) => ({
								label: synonym,
								text: "",
							}))}
					/>
				</View>
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
		month: date?.month ? "long" : undefined,
		day: date?.day ? "numeric" : undefined,
		year: date?.year ? "numeric" : undefined,
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
