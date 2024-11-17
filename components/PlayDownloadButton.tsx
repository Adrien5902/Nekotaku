import { Spacing, TextSizes } from "@/constants/Sizes";
import Icon, { AnimatedIcon } from "./Icon";
import { useAnimatedValue, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { type Href, router, useUnstableGlobalHref } from "expo-router";
import type { Episode, Lecteur } from "@/types/AnimeSama";
import type { MediaList, Media } from "@/types/Anilist";
import { useContext, useEffect, useState } from "react";
import {
	DownloadingContext,
	type DownloadingState,
} from "./DownloadingContext";
import type { Color } from "@/constants/Colors";

interface Props {
	mediaList: MediaList;
	episode: Episode;
	lecteur: Lecteur;
	color?: Color;
}

export default function PlayDownloadButton({
	mediaList,
	episode,
	lecteur,
	color,
}: Props) {
	const mediaId = mediaList.media?.id;
	if (!mediaId) {
		return <ThemedText>Error</ThemedText>;
	}

	const colors = useThemeColors();
	const iconColor = colors[color ?? "text"];
	const downloadingContext = useContext(DownloadingContext);
	const fillAnim = useAnimatedValue(0);

	const toState = (
		downloaded: boolean,
		currentlyDownloadingState: DownloadingState | null,
	) => {
		return downloaded
			? DownloadState.Downloaded
			: currentlyDownloadingState
				? currentlyDownloadingState.paused
					? DownloadState.PausedDownloading
					: DownloadState.Downloading
				: DownloadState.NotDownloaded;
	};

	const [state, setState] = useState<DownloadState>();

	const globalHref = useUnstableGlobalHref();

	const updateDownloadState = () => {
		let downloadingState: DownloadingState | null = null;
		const downloaded = downloadingContext.downloadedEpisodes[mediaId]?.includes(
			episode.id,
		);

		if (!downloaded) {
			downloadingState = downloadingContext.getDownloadingState(
				mediaId,
				episode.id,
				(state) => {
					if (state) {
						setState(toState(false, state));

						fillAnim.setValue(
							TextSizes.xl *
								(state.progressData.totalBytesWritten /
									state.progressData.totalBytesExpectedToWrite),
						);
					} else {
						const downloaded = downloadingContext.downloadedEpisodes[
							mediaId
						]?.includes(episode.id);

						setState(toState(downloaded, null));
					}
				},
			);
		}
		setState(toState(downloaded, downloadingState));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: on mounted effect
	useEffect(() => {
		updateDownloadState();

		() => {
			downloadingContext.getDownloadingState(mediaId, episode.id, null);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: on mounted effect
	useEffect(() => {
		updateDownloadState();
	}, [globalHref]);

	const playerPath: Href = {
		pathname: "/player",
		params: {
			episodeId: episode.id,
			lecteur: JSON.stringify(lecteur),
			mediaList: JSON.stringify(mediaList),
		},
	};

	let child: React.ReactNode;
	if (state === DownloadState.Downloaded) {
		child = (
			<>
				<Icon
					name={"trash"}
					style={{
						marginRight: Spacing.xl,
					}}
					onPress={() => {
						downloadingContext.deleteDownloadedEpisode(mediaId, episode.id);
						updateDownloadState();
					}}
					color={iconColor}
				/>
				<Icon
					size={TextSizes.xl}
					name={"play-downloaded"}
					onPress={() => {
						router.navigate(playerPath);
					}}
					color={iconColor}
				/>
			</>
		);
	} else if (state === DownloadState.NotDownloaded) {
		child = (
			<>
				<Icon
					onPress={async () => {
						setState(DownloadState.Downloading);
						await downloadingContext.startDownload(
							mediaList.media as Media,
							episode,
						);
						updateDownloadState();
					}}
					size={TextSizes.xl}
					name="download"
					style={{
						marginRight: Spacing.xl,
					}}
					color={iconColor}
				/>
				<Icon
					onPress={() => {
						router.navigate(playerPath);
					}}
					size={TextSizes.xl}
					color={iconColor}
					name="play"
				/>
			</>
		);
	} else {
		child = (
			<>
				<View
					style={{
						marginRight: Spacing.xl,
					}}
				>
					<Icon
						name={"download"}
						color={`${iconColor}60`}
						size={TextSizes.xl}
					/>

					<AnimatedIcon
						name={"download"}
						color={colors.accent}
						size={TextSizes.xl}
						style={{
							position: "absolute",
							height: fillAnim,
						}}
					/>
				</View>

				<Icon
					name={state === DownloadState.PausedDownloading ? "play" : "pause"}
					size={TextSizes.xl}
					style={{ marginRight: Spacing.xl }}
					onPress={() => {
						if (state === DownloadState.PausedDownloading) {
							downloadingContext.resumeDownload(mediaId, episode.id);
						} else {
							downloadingContext.pauseDownload(mediaId, episode.id);
						}
						updateDownloadState();
					}}
					color={iconColor}
				/>
				<Icon
					name={"xmark"}
					size={TextSizes.xl}
					onPress={async () => {
						await downloadingContext.cancelDownload(mediaId, episode.id);
						setState(DownloadState.NotDownloaded);
						updateDownloadState();
					}}
					color={iconColor}
				/>
			</>
		);
	}

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				padding: Spacing.m,
			}}
		>
			{child}
		</View>
	);
}

enum DownloadState {
	NotDownloaded = 0,
	Downloading = 1,
	PausedDownloading = 2,
	Downloaded = 3,
}
