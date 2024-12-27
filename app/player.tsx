import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import type React from "react";
import { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as StatusBar from "expo-status-bar";
import Player from "@/components/Player/Player";
import { ThemedView } from "@/components/ThemedView";
import { EpisodesList } from "@/components/Media/Episodes";
import type { Episode } from "@/types/AnimeSama";
import type { Media, MediaList, MediaTitle } from "@/types/Anilist/graphql";
import { AspectRatios, Spacing } from "@/constants/Sizes";
import { ThemedText } from "@/components/ThemedText";

export type VideoPlayerMedia =
	| (Pick<Media, "bannerImage" | "id" | "idMal"> & {
			title?: Pick<MediaTitle, "english" | "romaji"> | undefined | null;
			mediaListEntry?: Pick<MediaList, "progress"> | undefined | null;
	  })
	| undefined
	| null;

const VideoPlayer = () => {
	const {
		episodeId: episodeIdParam,
		media: mediaJSON,
		episodes: episodesJSON,
	} = useLocalSearchParams() as Record<string, string>;
	const media: VideoPlayerMedia = JSON.parse(mediaJSON);
	const episodes: Episode[] = JSON.parse(episodesJSON);
	const episode = episodes.find(
		(e) => e.id === Number.parseInt(episodeIdParam),
	);

	const [isFullscreen, setIsFullscreen] = useState(false);

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

	return episode ? (
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
					episode,
					toggleFullscreen,
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
							aspectRatio: AspectRatios.banner,
							resizeMode: "cover",
						}}
					/>
					<ScrollView style={{ flexDirection: "column", flex: 1 }}>
						<EpisodesList
							progress={media?.mediaListEntry?.progress}
							media={media}
							selected={episode.id}
							episodes={episodes}
						/>
					</ScrollView>
				</>
			) : null}
		</ThemedView>
	) : (
		<ThemedText>Error</ThemedText>
	);
};

export default VideoPlayer;
