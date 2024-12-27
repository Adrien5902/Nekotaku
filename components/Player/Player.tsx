import { AppState, View } from "react-native";
import Controls, { type Props as ControlsProps } from "./Controls";
import { type AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useContext, useEffect, useRef, useState } from "react";
import type { Episode, Lecteur } from "@/types/AnimeSama";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
	Directions,
	Gesture,
	GestureDetector,
} from "react-native-gesture-handler";
import { useRemoteMediaClient } from "react-native-google-cast";
import useStyles from "@/hooks/useStyles";
import type { PlayerFunctions, VideoPlayStatus } from "@/types/Player";
import CastControls from "./CastControls";
import Cache, { CacheReadType } from "@/hooks/useCache";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import useModal from "@/hooks/useModal";
import Slider from "@react-native-community/slider";
import { useThemeColors } from "@/hooks/useThemeColor";
import { SelectButtons } from "../SelectButtons";
import {
	supportedLecteurs,
	useGetVideoSource,
} from "@/hooks/useGetVideoSource";
import { useSettings } from "../Settings/Context";
import { DownloadingContext } from "../DownloadingContext";
import type React from "react";

interface Props {
	isFullscreen: boolean;
	episode: Episode;
	media: ControlsProps["media"];
	toggleFullscreen: (force?: boolean) => void;
}

export default function Player({
	isFullscreen,
	episode,
	media,
	toggleFullscreen,
}: Props) {
	const videoPlayerRef = useRef<Video>(null);
	const styles = useStyles();

	const settings = useSettings();

	const [selectedLecteur, setSelectedLecteur] = useState(
		episode?.lecteurs.find(
			(l) =>
				l.hostname.includes(settings.preferredLecteur) &&
				Object.keys(supportedLecteurs).find((l2) => l.hostname.includes(l2)),
		) ??
			episode?.lecteurs.find((l) =>
				Object.keys(supportedLecteurs).find((l2) => l.hostname.includes(l2)),
			),
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

	const googleCastMedia = useRemoteMediaClient();
	useEffect(() => {
		playerRef.current = !googleCastMedia
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
	}, [googleCastMedia]);

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

	const { modal: Modal, setModalVisible } = useModal("Close");
	const playbackSpeedRef = useRef(1);

	const error = selectedLecteur
		? errorGetVideoSource
		: new Error("Lecteur not supported");

	return (
		<>
			<Modal>
				<PlayerSettings
					{...{
						episode,
						playbackSpeedRef,
						playerRef,
						selectedLecteur,
						setSelectedLecteur,
					}}
				/>
			</Modal>
			<GestureDetector gesture={gesture}>
				<View>
					<Controls
						{...{
							setModalVisible,
							isFullscreen,
							playerRef,
							statusRef,
							loading,
							episode,
							toggleFullscreen,
							media,
						}}
						forceView={!!googleCastMedia}
					/>
					{!error ? (
						!googleCastMedia ? (
							<Video
								style={{
									...(isFullscreen ? styles.fullscreenVideo : styles.video),
									zIndex: -1,
									backgroundColor: "#000",
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
							<CastControls
								{...{
									episode,
									isFullscreen,
									isLoadingVid,
									playerRef,
									selectedLecteur,
									setIsLoadingVid,
									statusRef,
								}}
								media={googleCastMedia}
							/>
						)
					) : (
						<ThemedView
							style={[
								styles.video,
								{ zIndex: 10, justifyContent: "center", alignItems: "center" },
							]}
						>
							<ThemedText>Error : {error.message}</ThemedText>
						</ThemedView>
					)}
				</View>
			</GestureDetector>
		</>
	);
}

function PlayerSettings({
	episode,
	playerRef,
	playbackSpeedRef,
	selectedLecteur,
	setSelectedLecteur,
}: {
	selectedLecteur: Lecteur | undefined;
	setSelectedLecteur:
		| React.Dispatch<React.SetStateAction<Lecteur | undefined>>
		| undefined;
	episode: Episode;
	playerRef: React.MutableRefObject<PlayerFunctions | undefined>;
	playbackSpeedRef: React.MutableRefObject<number>;
}) {
	const colors = useThemeColors();
	const [playBackSpeed, setPlaybackSpeed] = useState(playbackSpeedRef.current);
	return (
		<View
			style={{
				alignSelf: "flex-start",
			}}
		>
			<ThemedText size="m">
				Playback speed : x{playBackSpeed.toFixed(2)}
			</ThemedText>

			<Slider
				minimumValue={0.05}
				maximumValue={2}
				step={0.05}
				value={playBackSpeed}
				onValueChange={(value) => {
					playerRef.current?.setPlaybackSpeedAsync(value);
					playbackSpeedRef.current = value;
					setPlaybackSpeed(value);
				}}
				thumbTintColor={colors.accent}
				minimumTrackTintColor={colors.accent}
				maximumTrackTintColor={colors.text}
			/>

			<SelectButtons
				buttons={[0.5, 1, 1.5, 2].map((n) => ({
					key: n.toString(),
					title: `x${n}`,
				}))}
				defaultValue={playBackSpeed.toString()}
				onValueChange={(value) => {
					const n = Number.parseFloat(value);
					playerRef.current?.setPlaybackSpeedAsync(n);
					playbackSpeedRef.current = n;
					setPlaybackSpeed(n);
				}}
			/>

			<ThemedText size="m">Selected Lecteur :</ThemedText>
			<SelectButtons
				buttons={episode.lecteurs
					.filter(
						(l, i) =>
							episode.lecteurs.findIndex((l2) => l2.hostname === l.hostname) ===
								i &&
							Object.keys(supportedLecteurs).find((l2) =>
								l.hostname.includes(l2),
							),
					)
					.map((l) => ({
						key: l.id.toString(),
						title: l.hostname,
					}))}
				defaultValue={selectedLecteur?.id.toString()}
				onValueChange={(value) => {
					if (setSelectedLecteur)
						setSelectedLecteur(episode.lecteurs[Number.parseInt(value) - 1]);
				}}
			/>
		</View>
	);
}
