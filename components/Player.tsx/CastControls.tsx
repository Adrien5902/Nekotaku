import { Spacing, TextSizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import {
	MediaPlayerState,
	useCastDevice,
	type RemoteMediaClient,
} from "react-native-google-cast";
import type { Episode } from "@/types/AnimeSama";
import useStyles from "@/hooks/useStyles";
import type { PlayerFunctions, VideoPlayStatus } from "@/types/Player";
import { usePromise } from "@/hooks/usePromise";
import { getVideoUri } from "@/hooks/useGetVideoSource";
import { useEffect } from "react";

export default function CastControls({
	episode,
	isFullscreen,
	media,
	setIsLoadingVid,
	loadingVid,
	statusRef,
	playerRef,
}: {
	media: RemoteMediaClient | null;
	episode: Episode;
	isFullscreen: boolean;
	setIsLoadingVid: React.Dispatch<React.SetStateAction<boolean>>;
	loadingVid: boolean;
	playerRef: React.MutableRefObject<PlayerFunctions | undefined>;
	statusRef: React.MutableRefObject<VideoPlayStatus>;
}) {
	const styles = useStyles();
	const videoSource = episode.url;
	const {
		data: videoUri,
		loading,
		error,
	} = usePromise(() => getVideoUri(videoSource)[0], [episode.id]);

	const device = useCastDevice();

	useEffect(() => {
		if (!loading && videoUri && media) {
			const progressSub = media.onMediaProgressUpdated((progres) => {
				if (statusRef.current)
					statusRef.current.positionMillis = progres * 1000;
			});

			const statusSub = media.onMediaStatusUpdated((currentStatus) => {
				if (statusRef.current) {
					statusRef.current.durationMillis = currentStatus?.mediaInfo
						?.streamDuration
						? currentStatus?.mediaInfo?.streamDuration * 1000
						: undefined;
					if (currentStatus?.playerState) {
						switch (currentStatus.playerState) {
							case MediaPlayerState.PLAYING:
								if (loadingVid) {
									setIsLoadingVid(false);
								}
								statusRef.current.isPlaying = true;
								break;
							case MediaPlayerState.LOADING:
								setIsLoadingVid(true);
								break;
							case MediaPlayerState.PAUSED:
								if (loadingVid) {
									setIsLoadingVid(false);
								}
								statusRef.current.isPlaying = false;
								break;

							default:
								break;
						}
					}
				}
			});

			media.loadMedia({
				mediaInfo: {
					contentUrl: videoUri,
					contentType: "video/mp4",
				},
			});

			playerRef.current = {
				playAsync: media.play,
				pauseAsync: media.pause,
				async setPositionAsync(positionMillis) {
					media.seek({
						position: positionMillis / 1000,
					});
				},
			};

			return () => {
				statusSub.remove();
				progressSub.remove();
			};
		}
	});

	return (
		<ThemedView
			style={{
				...(isFullscreen ? styles.fullscreenVideo : styles.video),
				zIndex: -1,
				paddingTop: Spacing.m * 3 + TextSizes.m,
				justifyContent: "flex-start",
				alignItems: "center",
			}}
		>
			<ThemedText>
				Casting on{" "}
				{`${device?.friendlyName ?? "?"} - ${device?.modelName ?? "ChromeCast"}`}
			</ThemedText>
		</ThemedView>
	);
}
