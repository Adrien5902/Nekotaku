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
}: {
	media?:
		| (PlayDownloadButtonProps["media"] & AnimeSamaSearchMediaType)
		| undefined
		| null;
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
					{...{ media, url, lang }}
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
}: {
	media: PlayDownloadButtonProps["media"];
	lecteur: Lecteur | undefined;
	selected?: number;
}) {
	return (
		<>
			{lecteur?.episodes.map((episode) => (
				<EpisodeButton
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
}: {
	media: PlayDownloadButtonProps["media"];
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
			{media ? (
				<PlayDownloadButton
					media={media}
					lecteur={lecteur}
					episode={episode}
					color={selected ? "background" : "text"}
				/>
			) : null}
		</ThemedView>
	);
}
