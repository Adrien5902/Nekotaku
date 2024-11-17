import { useGetVideoSource } from "@/hooks/useGetVideoSource";
import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as StatusBar from "expo-status-bar";
import Player from "@/components/Player.tsx/Player";
import { ThemedView } from "@/components/ThemedView";
import { EpidosesList } from "@/components/Media/Epidoses";
import type { Lecteur } from "@/types/AnimeSama";
import { DownloadingContext } from "@/components/DownloadingContext";
import type { MediaList } from "@/types/Anilist";
import { Spacing } from "@/constants/Sizes";

const VideoPlayer = () => {
	const {
		episodeId: episodeIdParam,
		mediaList: mediaListJSON,
		lecteur: lecteurJSON,
	} = useLocalSearchParams() as Record<string, string>;
	const meidaList: MediaList = JSON.parse(mediaListJSON);
	const lecteur: Lecteur = JSON.parse(lecteurJSON);
	const episode = lecteur.episodes[Number.parseInt(episodeIdParam)];

	const downloadingContext = useContext(DownloadingContext);
	const { loading: isGetVideoSourceLoading, data: videoUri } =
		useGetVideoSource(
			downloadingContext,
			meidaList.media?.id as number,
			episode,
		);
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

			const lanscaped =
				orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
				orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

			const portraited =
				orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
				orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;

			if (unlocked) {
				if (lanscaped) {
					toggleFullscreen(true);
				} else if (portraited) {
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
					mediaList: meidaList,
					toggleFullscreen,
					videoUri,
					setIsLoadingVid,
				}}
			/>
			{!isFullscreen ? (
				<View style={{ flexDirection: "column", flex: 1 }}>
					<Image
						source={{ uri: meidaList.media?.bannerImage ?? undefined }}
						style={{
							width: "100%",
							aspectRatio: 14 / 3,
							resizeMode: "contain",
						}}
					/>
					<EpidosesList
						lecteur={lecteur}
						mediaList={meidaList}
						selected={episode.id}
					/>
				</View>
			) : null}
		</ThemedView>
	) : (
		<Text>Error</Text>
	);
};

export default VideoPlayer;

const { width, height } = Dimensions.get("window");
