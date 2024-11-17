import {
	AnimeSamaUrl,
	type Episode,
	type Lang,
	type Lecteur,
} from "@/types/AnimeSama";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useEffect, useState } from "react";
import { SelectButtons } from "../SelectButtons";
import { RefreshControl, ScrollView, View } from "react-native";
import type { Media, MediaList } from "@/types/Anilist";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useAnimeSamaGetLecteurs } from "@/hooks/useAnimeSamaGetEpisodes";
import { useMemoryCachedPromise, usePromise } from "@/hooks/usePromise";
import PlayDownloadButton from "../PlayDownloadButton";
import { Spacing } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { useAnimeSamaSearch } from "@/hooks/useAnimeSamaSearch";

export default function EpisodesCollection({
	mediaList,
}: { mediaList: MediaList }) {
	const media = mediaList?.media as Media;
	const {
		loading: loadingAnimeSama,
		data: animeSamaData,
		error,
		refresh: refreshAnimeSamaSearch,
	} = useAnimeSamaSearch(media);

	const searchResult = animeSamaData?.result;
	const url = searchResult?.url
		? (AnimeSamaUrl.fromURL(searchResult?.url) ?? undefined)
		: undefined;

	const colors = useThemeColors();
	const {
		data,
		loading: loadingLangs,
		error: errorLangs,
		refresh: refreshLangsAndEpisodes,
	} = useMemoryCachedPromise(
		"getAvailableLangsAndEpisodes",
		async () => await url?.getAvailableLangsAndEpisodes(),
		[animeSamaData],
	);
	const langs = data?.langs;
	const customEpisodesData = data?.customEpisodes;

	const [lang, setLang] = useState<keyof typeof Lang | null>(null);

	const {
		data: lecteurs,
		loading: loadingEpisodes,
		error: errorEpisodes,
		refresh: refreshAnimeSamaGetLecteurs,
	} = useAnimeSamaGetLecteurs(url ?? undefined, lang, customEpisodesData);

	useEffect(() => {
		if (langs) {
			setLang(langs[0]);
		}
	}, [langs]);

	function refresh() {
		refreshAnimeSamaSearch();
		refreshLangsAndEpisodes();
		refreshAnimeSamaGetLecteurs();
	}

	const loading = loadingAnimeSama || loadingLangs || !lang;

	if (errorLangs || error) {
		return <ThemedText>{(errorLangs || error)?.message}</ThemedText>;
	}

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={loading} onRefresh={refresh} />
			}
			style={{ flex: 1, margin: Spacing.m }}
		>
			{!loading ? (
				<SelectButtons
					buttons={langs?.map((lang) => lang) ?? []}
					defaultValue={lang}
					onValueChange={(value) => {
						setLang(value as keyof typeof Lang);
					}}
					buttonStyle={{
						marginHorizontal: Spacing.m,
						marginBottom: Spacing.m,
						padding: 8,
						borderRadius: 8,
						borderColor: colors.text,
						borderWidth: 1,
					}}
					textStyle={{ color: colors.text }}
					activeStyle={{
						backgroundColor: colors.accent,
						borderColor: colors.accent,
					}}
					activeTextStyle={{ color: colors.background, fontWeight: "800" }}
				/>
			) : null}
			{errorEpisodes ? (
				<ThemedText>{errorEpisodes.message}</ThemedText>
			) : !loadingEpisodes && lecteurs ? (
				<EpidosesList
					{...{ mediaList, url, lang }}
					lecteur={
						lecteurs.find((l) => l.hostname.includes("sibnet.ru")) ??
						lecteurs[0]
					}
				/>
			) : (
				<ThemedText>Retrieving episodes...</ThemedText>
			)}
		</ScrollView>
	);
}

export function EpidosesList({
	mediaList,
	lecteur,
	selected,
}: {
	mediaList: MediaList;
	lecteur: Lecteur;
	selected?: number;
}) {
	return (
		<>
			{lecteur.episodes.map((episode) => (
				<EpisodeButton
					episode={episode}
					{...{ mediaList, lecteur }}
					key={episode.id}
					selected={selected === episode.id}
				/>
			))}
			<View style={{ height: Spacing.xl * 2 }} />
		</>
	);
}

function EpisodeButton({
	mediaList,
	episode,
	selected,
	lecteur,
}: {
	mediaList: MediaList;
	selected?: boolean;
	episode: Episode;
	lecteur: Lecteur;
}) {
	const styles = useStyles();

	return (
		<ThemedView
			color={selected !== undefined && selected ? "accent" : "background"}
			style={styles.PrimaryElement}
		>
			<View>
				<ThemedText
					size="m"
					weight={selected ? "bold" : undefined}
					numberOfLines={1}
					color={selected ? "background" : "text"}
				>
					{typeof episode.name === "string"
						? episode.name
						: `Épisode ${episode.name}`}
				</ThemedText>
			</View>
			{mediaList.media ? (
				<PlayDownloadButton
					mediaList={mediaList}
					lecteur={lecteur}
					episode={episode}
					color={selected ? "background" : "text"}
				/>
			) : null}
		</ThemedView>
	);
}
