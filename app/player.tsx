import { useGetVideoSource } from "@/hooks/useGetVideoSource";
import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import { Text, Dimensions, Image, ScrollView } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as StatusBar from "expo-status-bar";
import Player from "@/components/Player/Player";
import { ThemedView } from "@/components/ThemedView";
import { EpisodesList } from "@/components/Media/Episodes";
import type { Lecteur } from "@/types/AnimeSama";
import { DownloadingContext } from "@/components/DownloadingContext";
import type { Media, MediaTitle } from "@/types/Anilist/graphql";
import { Spacing } from "@/constants/Sizes";

export type VideoPlayerMedia = Pick<Media, "bannerImage" | "id" | "idMal"> & {
	title: Pick<MediaTitle, "english" | "romaji">;
};

const VideoPlayer = () => {
	const {
		episodeId: episodeIdParam,
		media: mediaJSON,
		lecteur: lecteurJSON,
	} = useLocalSearchParams() as Record<string, string>;
	const media: VideoPlayerMedia = JSON.parse(mediaJSON);
	const lecteur: Lecteur = JSON.parse(lecteurJSON);
	const episode = lecteur.episodes[Number.parseInt(episodeIdParam)];

	const downloadingContext = useContext(DownloadingContext);
	const { loading: isGetVideoSourceLoading, data: videoUri } =
		useGetVideoSource(downloadingContext, media?.id ?? 0, episode);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isLoadingVid, setIsLoadingVid] = useState(true);

	const loading = isLoadingVid || isGetVideoSourceLoading;

	useEffect(() => {
		ScreenOrientation.unlockAsync();
		const sub = ScreenOrientation.addOrientationChangeListener((e) => {
			const { orientation } = e.orientationInfo;

			const unlocked =
				e.orientationLock === ScreenOrientation.OrientationLock.ALL ||
				e.orientationLock === ScreenOrientation.OrientationLock.DEFAULT;

			const landscaped =
				orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
				orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

			const portrait =
				orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
				orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;

			if (unlocked) {
				if (landscaped) {
					toggleFullscreen(true);
				} else if (portrait) {
					toggleFullscreen(false);
				}
			}
		});
		return () => {
			ScreenOrientation.removeOrientationChangeListener(sub);
		};
	}, []);

	const toggleFullscreen = (force?: boolean) => {
		const fullscreen = force ?? !isFullscreen;

		if (force === undefined) {
			ScreenOrientation.lockAsync(
				fullscreen
					? ScreenOrientation.OrientationLock.LANDSCAPE
					: ScreenOrientation.OrientationLock.PORTRAIT,
			);
		} /*  else {
			ScreenOrientation.unlockAsync();
		} */

		StatusBar.setStatusBarHidden(fullscreen, "slide");
		NavigationBar.setVisibilityAsync(fullscreen ? "hidden" : "visible");

		setIsFullscreen(fullscreen);
	};

	return loading || videoUri ? (
		<ThemedView
			style={{
				flex: 1,
				flexDirection: "column",
				position: "relative",
				paddingTop: isFullscreen ? 0 : Spacing.xl,
			}}
		>
			<Player
				{...{
					isFullscreen,
					setIsFullscreen,
					loading,
					episode,
					toggleFullscreen,
					videoUri,
					setIsLoadingVid,
					media,
				}}
				key={episode.id}
			/>
			{!isFullscreen ? (
				<>
					<Image
						source={{ uri: media?.bannerImage ?? undefined }}
						style={{
							width: "100%",
							aspectRatio: 14 / 3,
							resizeMode: "contain",
						}}
					/>
					<ScrollView style={{ flexDirection: "column", flex: 1 }}>
						<EpisodesList
							lecteur={lecteur}
							media={media}
							selected={episode.id}
						/>
					</ScrollView>
				</>
			) : null}
		</ThemedView>
	) : (
		<Text>Error</Text>
	);
};

export default VideoPlayer;

const { width, height } = Dimensions.get("window");
