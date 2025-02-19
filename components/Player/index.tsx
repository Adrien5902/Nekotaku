import { AppState, View } from "react-native";
import Controls from "./Controls";
import { type AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useContext, useEffect, useRef, useState } from "react";
import type { Episode } from "@/types/AnimeSama";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
	Directions,
	Gesture,
	GestureDetector,
} from "react-native-gesture-handler";
import { useRemoteMediaClient } from "react-native-google-cast";
import useStyles from "@/hooks/useStyles";
import type { PlayerFunctions, VideoPlayStatus } from "@/types/Player";
import CastControls from "./Controls/CastControls";
import Cache, { CacheReadType } from "@/hooks/useCache";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import Modal, { type ModalState } from "@/components/Modal";
import { useGetVideoSource } from "@/hooks/useGetVideoSource";
import { useSettings } from "../Settings/Context";
import { DownloadingContext } from "../DownloadingContext";
import type React from "react";
import { getPreferredLecteur } from "../Settings/types";
import { PlayerSettings } from "./PlayerSettings";
import {
	PlayerContextProvider,
	type PlayerContextT,
} from "./PlayerContextProvider";
import useLang from "@/hooks/useLang";
import { Spacing } from "@/constants/Sizes";

interface Props {
	isFullscreen: boolean;
	episode: Episode;
	episodes: Episode[];
	media: PlayerContextT["media"];
	toggleFullscreen: (force?: boolean) => void;
}

export default function Player({
	isFullscreen,
	episode,
	media,
	toggleFullscreen,
	episodes,
}: Props) {
	const videoPlayerRef = useRef<Video>(null);
	const styles = useStyles();

	const settings = useSettings();

	const [selectedLecteur, setSelectedLecteur] = useState(
		getPreferredLecteur(episode, settings),
	);

	const downloadingContext = useContext(DownloadingContext);
	const {
		loading: isGetVideoSourceLoading,
		data: videoUri,
		error: errorGetVideoSource,
	} = useGetVideoSource(
		downloadingContext,
		media?.id ?? 0,
		episode?.id,
		selectedLecteur,
	);

	const [isLoadingVid, setIsLoadingVid] = useState(true);

	const loading = isLoadingVid || isGetVideoSourceLoading;

	async function savePos() {
		// Do not save if position or duration is 0
		if (statusRef.current.positionMillis && statusRef.current.durationMillis) {
			await Cache.write(
				CacheReadType.MemoryAndIfNotDisk,
				"episodeProgress",
				[media?.id ?? 0, episode.id],
				{
					...statusRef.current,
				},
				true,
			);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const subs = [
			AppState.addEventListener("focus", () => {
				videoPlayerRef.current?.playAsync();
			}),
			AppState.addEventListener("blur", () => {
				videoPlayerRef.current?.pauseAsync();
			}),
			AppState.addEventListener("change", (e) => {
				if (e === "background") {
					savePos();
				}
			}),
		];

		return () => {
			for (const sub of subs) {
				sub.remove();
			}
			savePos();
		};
	}, []);

	const { data: startPos } = Cache.use(CacheReadType.Disk, "episodeProgress", [
		media?.id ?? 0,
		episode.id,
	]);

	const isAwake = useRef(false);

	useEffect(() => {
		if (loading) {
			videoPlayerRef.current?.pauseAsync();
		} else {
			videoPlayerRef.current?.playAsync();
		}
	}, [loading]);

	const remoteMediaClient = useRemoteMediaClient();

	useEffect(() => {
		playerRef.current = !remoteMediaClient
			? {
					async playAsync() {
						await videoPlayerRef.current?.playAsync();
					},
					async pauseAsync() {
						await videoPlayerRef.current?.pauseAsync();
					},
					async setPositionAsync(positionMillis) {
						await videoPlayerRef.current?.setPositionAsync(positionMillis);
					},
					async setPlaybackSpeedAsync(value) {
						await videoPlayerRef.current?.setRateAsync(value, true);
					},
				}
			: undefined;
	}, [remoteMediaClient]);

	useEffect(() => {
		if (remoteMediaClient && videoUri) {
			remoteMediaClient.loadMedia({
				mediaInfo: {
					contentUrl: videoUri,
					contentType: "video/mp4",
				},
			});
		}
	}, [videoUri, remoteMediaClient]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		savePos();
	}, [videoUri]);

	const playerRef = useRef<PlayerFunctions>();
	const statusRef = useRef<VideoPlayStatus>({
		isPlaying: false,
		positionMillis: 0,
	});

	const gesture = Gesture.Fling();
	gesture.direction(isFullscreen ? Directions.DOWN : Directions.UP);
	gesture.onEnd(() => {
		toggleFullscreen();
	});

	const playbackSpeedRef = useRef(1);

	const error = selectedLecteur
		? errorGetVideoSource
		: new Error("Lecteur not supported");

	const forceViewControls = !!remoteMediaClient;
	const playerStyle = isFullscreen ? styles.fullscreenVideo : styles.video;

	const lang = useLang();
	const settingsModal = useRef<ModalState>(null);

	return (
		<PlayerContextProvider
			{...{
				episode,
				isFullscreen,
				loading,
				setIsLoadingVid,
				media,
				setSettingsVisible: settingsModal.current?.setVisible,
				toggleFullscreen,
				playerRef,
				statusRef,
				forceViewControls,
				playerStyle,
				episodes,
			}}
		>
			<Modal closeButton={lang.pages.player.settings.close} ref={settingsModal}>
				<PlayerSettings
					{...{ playbackSpeedRef, selectedLecteur, setSelectedLecteur }}
				/>
			</Modal>
			<GestureDetector gesture={gesture}>
				<View style={{ backgroundColor: "#000" }}>
					<Controls />
					{!error ? (
						!remoteMediaClient ? (
							<Video
								style={{
									...(isFullscreen ? styles.fullscreenVideo : styles.video),
									zIndex: -1,
								}}
								source={videoUri ? { uri: videoUri } : undefined}
								ref={videoPlayerRef}
								shouldPlay
								resizeMode={ResizeMode.CONTAIN}
								positionMillis={startPos?.positionMillis ?? 0}
								onPlaybackStatusUpdate={(s) => {
									const status = s as AVPlaybackStatusSuccess;
									statusRef.current = status;

									if (status.playableDurationMillis)
										setIsLoadingVid(
											status.playableDurationMillis <= status.positionMillis,
										);

									if (!isAwake.current && status.isPlaying) {
										activateKeepAwakeAsync();
										isAwake.current = true;
									} else if (isAwake.current && !status.isPlaying) {
										deactivateKeepAwake();
										isAwake.current = false;
									}
								}}
								onLoad={() => {
									videoPlayerRef.current?.setPositionAsync(
										startPos?.positionMillis ?? 0,
									);
									setIsLoadingVid(false);
								}}
							/>
						) : (
							<CastControls />
						)
					) : (
						<ThemedView
							style={[
								styles.video,
								{
									paddingTop: Spacing.xxl,
									alignItems: "center",
									paddingBottom: Spacing.xxl,
								},
							]}
						>
							<ThemedText>Error : {error.message}</ThemedText>
						</ThemedView>
					)}
				</View>
			</GestureDetector>
		</PlayerContextProvider>
	);
}
