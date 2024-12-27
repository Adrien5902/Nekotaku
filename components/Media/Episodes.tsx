import { AnimeSamaUrl, type Episode, type Lang } from "@/types/AnimeSama";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useEffect, useState } from "react";
import { SelectButtons } from "../SelectButtons";
import { RefreshControl, ScrollView, View } from "react-native";
import { useAnimeSamaGetEpisodes } from "@/hooks/useAnimeSamaGetEpisodes";
import PlayDownloadButton, {
	type Props as PlayDownloadButtonProps,
} from "../PlayDownloadButton";
import { Spacing } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import {
	type AnimeSamaSearchMediaType,
	useAnimeSamaSearch,
} from "@/hooks/useAnimeSamaSearch";
import type { MediaList } from "@/types/Anilist/graphql";
import Cache, { CacheReadType } from "@/hooks/useCache";
import { useCachedPromise } from "@/hooks/usePromise";
import useLang from "@/hooks/useLang";
import { useSettings } from "../Settings/Context";
import React from "react";

export default function EpisodesCollection({
	media,
	progress,
}: {
	media?:
		| (PlayDownloadButtonProps["media"] & AnimeSamaSearchMediaType)
		| undefined
		| null;
	progress: MediaList["progress"];
}) {
	const settings = useSettings();
	const {
		loading: loadingAnimeSama,
		data: animeSamaData,
		error: errorSearch,
		refresh: refreshAnimeSamaSearch,
	} = useAnimeSamaSearch(media);

	const searchResult = animeSamaData?.result;
	const url = searchResult?.url
		? (AnimeSamaUrl.fromURL(searchResult?.url) ?? undefined)
		: undefined;

	const {
		data,
		loading: loadingLangs,
		refresh: refreshLangsAndEpisodes,
		error: errorLangs,
	} = useCachedPromise(
		CacheReadType.MemoryAndIfNotDisk,
		"langsAndEpisodes",
		async () => await url?.getAvailableLangsAndEpisodes(),
		[animeSamaData],
	);
	const langs = data?.langs;
	const customEpisodesData = data?.customEpisodes;

	const [selectedLang, setLang] = useState<keyof typeof Lang | null>(null);

	const {
		data: episodes,
		loading: loadingEpisodes,
		error: errorEpisodes,
		refresh: refreshAnimeSamaGetLecteurs,
	} = useAnimeSamaGetEpisodes(
		url ?? undefined,
		selectedLang,
		customEpisodesData,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (langs) {
			const validLangSelected = selectedLang && langs.includes(selectedLang);
			if (!validLangSelected) setLang(langs[0]);
		}
	}, [langs]);

	function refresh() {
		refreshAnimeSamaSearch();
		refreshLangsAndEpisodes();
		refreshAnimeSamaGetLecteurs();
	}

	const loading = loadingAnimeSama || loadingLangs || !selectedLang;
	const lang = useLang();

	const error = errorEpisodes || errorLangs || errorSearch;
	if (!settings.offlineMode && error) {
		return <ThemedText>{error?.message}</ThemedText>;
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
					defaultValue={selectedLang}
					onValueChange={(value) => {
						setLang(value as keyof typeof Lang);
					}}
				/>
			) : null}
			{!loadingEpisodes && episodes ? (
				<EpisodesList {...{ media, url, progress, episodes }} />
			) : (
				<ThemedText>{lang.pages.episodes.loading}</ThemedText>
			)}
			<View style={{ height: Spacing.l * 3 }} />
		</ScrollView>
	);
}

export function EpisodesList({
	media,
	episodes,
	selected,
	progress,
}: {
	media: PlayDownloadButtonProps["media"];
	progress: MediaList["progress"];
	episodes: Episode[] | undefined;
	selected?: number;
}) {
	const lastWatchedEpisodeId = episodes?.find((ep) => {
		const num =
			typeof ep.name === "number" ? ep.name : Number.parseInt(ep.name);
		if (!Number.isNaN(num)) {
			return num === progress;
		}
	})?.id;

	return (
		<>
			{episodes?.map((episode) => (
				<EpisodeButton
					watched={
						lastWatchedEpisodeId !== undefined
							? lastWatchedEpisodeId >= episode.id
							: false
					}
					episode={episode}
					{...{ media, episodes }}
					key={episode.id}
					selected={selected === episode.id}
				/>
			))}
			<View style={{ height: Spacing.xl * 2 }} />
		</>
	);
}

function EpisodeButton({
	media,
	episode,
	selected,
	watched,
	episodes,
}: {
	media: PlayDownloadButtonProps["media"];
	selected?: boolean;
	episode: Episode;
	episodes: Episode[];
	watched: boolean;
}) {
	const styles = useStyles();
	const { data: progress } = Cache.use(CacheReadType.Disk, "episodeProgress", [
		media?.id ?? 0,
		episode.id,
	]);
	const lang = useLang();

	return (
		<ThemedView
			color={selected !== undefined && selected ? "primary" : "background"}
			style={[
				styles.PrimaryElement,
				{ padding: 0, flexDirection: "column", alignItems: "stretch" },
			]}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					flex: 1,
				}}
			>
				<ThemedText
					style={{ paddingLeft: Spacing.m }}
					size="m"
					weight={selected ? "bold" : undefined}
					numberOfLines={1}
				>
					{typeof episode.name === "string"
						? episode.name
						: lang.pages.episodes.episode(episode.name)}
				</ThemedText>
				{media ? (
					<PlayDownloadButton
						media={media}
						episode={episode}
						episodes={episodes}
					/>
				) : null}
			</View>
			<ThemedView
				color="text"
				style={{
					height: Spacing.s,
					width: "100%",
				}}
			>
				<ThemedView
					color="accent"
					style={{
						flex: 1,
						width: `${watched ? 100 : (progress?.durationMillis ? progress.positionMillis / progress.durationMillis : 0) * 100}%`,
					}}
				/>
			</ThemedView>
		</ThemedView>
	);
}
