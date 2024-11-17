import {
	AppState,
	Dimensions,
	StyleSheet,
	type TextStyle,
	View,
	type ViewStyle,
} from "react-native";
import Controls from "./Controls";
import { type AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import { useEffect, useRef } from "react";
import type { MediaList } from "@/types/Anilist";
import type { Episode } from "@/types/AnimeSama";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
	Directions,
	Gesture,
	GestureDetector,
} from "react-native-gesture-handler";
import {
	MediaPlayerState,
	type RemoteMediaClient,
	useRemoteMediaClient,
} from "react-native-google-cast";
import useStyles from "@/hooks/useStyles";
import type { PlayerFunctions, VideoPlayStatus } from "@/types/Player";
import CastControls from "./CastControls";
import DiskCache from "@/hooks/useDiskCache";

interface Props {
	isFullscreen: boolean;
	loading: boolean;
	episode: Episode;
	mediaList: MediaList;
	toggleFullscreen: (force?: boolean) => void;
	setIsLoadingVid: React.Dispatch<React.SetStateAction<boolean>>;
	videoUri?: string;
}

export default function Player({
	isFullscreen,
	loading,
	episode,
	mediaList,
	toggleFullscreen,
	setIsLoadingVid,
	videoUri,
}: Props) {
	const videoPlayerRef = useRef<Video>(null);
	const styles = useStyles();

	async function savePos() {
		await DiskCache.write(
			"episodePositionMillis",
			[mediaList.media?.id, episode.id],
			statusRef.current.positionMillis,
		);
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

	const { data: startPos } = DiskCache.use<number>("episodePositionMillis", [
		mediaList.media?.id,
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

	return (
		<GestureDetector gesture={gesture}>
			<View>
				<Controls
					{...{
						isFullscreen,
						playerRef,
						statusRef,
						loading,
						episode,
						mediaList,
						toggleFullscreen,
					}}
					forceView={!!googleCastMedia}
				/>
				{!googleCastMedia ? (
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
						positionMillis={startPos ?? 0}
						onPlaybackStatusUpdate={(s) => {
							const status = s as AVPlaybackStatusSuccess;
							statusRef.current = status;

							if (!isAwake.current && status.isPlaying) {
								activateKeepAwakeAsync();
								isAwake.current = true;
							} else if (isAwake.current && !status.isPlaying) {
								deactivateKeepAwake();
								isAwake.current = false;
							}
						}}
						onLoad={() => {
							setIsLoadingVid(false);
						}}
					/>
				) : (
					<CastControls
						setIsLoadingVid={setIsLoadingVid}
						episode={episode}
						isFullscreen={isFullscreen}
						media={googleCastMedia}
						loadingVid={loading}
						statusRef={statusRef}
						playerRef={playerRef}
					/>
				)}
			</View>
		</GestureDetector>
	);
}
