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
import { useAnimeSamaGetLecteurs } from "@/hooks/useAnimeSamaGetEpisodes";
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

	const {
		data,
		loading: loadingLangs,
		refresh: refreshLangsAndEpisodes,
	} = useCachedPromise(
		CacheReadType.MemoryAndIfNotDisk,
		"langsAndEpisodes",
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

	if (error) {
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
					defaultValue={lang}
					onValueChange={(value) => {
						setLang(value as keyof typeof Lang);
					}}
				/>
			) : null}
			{errorEpisodes ? (
				<ThemedText>{errorEpisodes.message}</ThemedText>
			) : !loadingEpisodes && lecteurs ? (
				<EpisodesList
					{...{ media, url, lang, progress }}
					lecteur={
						lecteurs.find((l) => l.hostname.includes("sibnet.ru")) ??
						lecteurs[0]
					}
				/>
			) : (
				<ThemedText>Retrieving episodes...</ThemedText>
			)}
			<View style={{ height: Spacing.l * 3 }} />
		</ScrollView>
	);
}

export function EpisodesList({
	media,
	lecteur,
	selected,
	progress,
}: {
	media: PlayDownloadButtonProps["media"];
	progress: MediaList["progress"];
	lecteur: Lecteur | undefined;
	selected?: number;
}) {
	const lastWatchedEpisodeId = lecteur?.episodes.find((ep) => {
		const num =
			typeof ep.name === "number" ? ep.name : Number.parseInt(ep.name);
		if (!Number.isNaN(num)) {
			return num === progress;
		}
	})?.id;

	return (
		<>
			{lecteur?.episodes.map((episode) => (
				<EpisodeButton
					watched={
						lastWatchedEpisodeId ? lastWatchedEpisodeId >= episode.id : false
					}
					episode={episode}
					{...{ media, lecteur }}
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
	lecteur,
	watched,
}: {
	media: PlayDownloadButtonProps["media"];
	selected?: boolean;
	episode: Episode;
	lecteur: Lecteur;
	watched: boolean;
}) {
	const styles = useStyles();
	const { data: progress } = Cache.use(CacheReadType.Disk, "episodeProgress", [
		media?.id ?? 0,
		episode.id,
	]);

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
						: `Épisode ${episode.name}`}
				</ThemedText>
				{media ? (
					<PlayDownloadButton
						media={media}
						lecteur={lecteur}
						episode={episode}
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
