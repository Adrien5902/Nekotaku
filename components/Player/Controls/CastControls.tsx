import { Spacing, TextSizes } from "@/constants/Sizes";
import { ThemedView } from "../../ThemedView";
import { ThemedText } from "../../ThemedText";
import {
	MediaPlayerState,
	useCastDevice,
	useRemoteMediaClient,
} from "react-native-google-cast";
import { useEffect } from "react";
import usePlayerContext from "../PlayerContextProvider";

export default function CastControls() {
	const remoteMediaClient = useRemoteMediaClient();
	const { playerRef, statusRef, loading, setIsLoadingVid, playerStyle } =
		usePlayerContext();

	const device = useCastDevice();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (remoteMediaClient) {
			const progressSub = remoteMediaClient.onMediaProgressUpdated(
				(progress) => {
					if (statusRef.current)
						statusRef.current.positionMillis = progress * 1000;
				},
			);

			const statusSub = remoteMediaClient.onMediaStatusUpdated(
				(currentStatus) => {
					if (statusRef.current) {
						statusRef.current.durationMillis = currentStatus?.mediaInfo
							?.streamDuration
							? currentStatus?.mediaInfo?.streamDuration * 1000
							: undefined;
						if (currentStatus?.playerState) {
							switch (currentStatus.playerState) {
								case MediaPlayerState.PLAYING:
									setIsLoadingVid(false);

									statusRef.current.isPlaying = true;
									break;
								case MediaPlayerState.LOADING:
									setIsLoadingVid(true);
									break;

								case MediaPlayerState.BUFFERING:
									setIsLoadingVid(true);
									break;

								case MediaPlayerState.PAUSED:
									setIsLoadingVid(false);

									statusRef.current.isPlaying = false;
									break;

								default:
									break;
							}
						}
					}
				},
			);

			playerRef.current = {
				playAsync: remoteMediaClient.play,
				pauseAsync: remoteMediaClient.pause,
				async setPositionAsync(positionMillis) {
					remoteMediaClient.seek({
						position: positionMillis / 1000,
					});
				},
				async setPlaybackSpeedAsync(value) {
					remoteMediaClient.setPlaybackRate(value);
				},
			};

			return () => {
				statusSub.remove();
				progressSub.remove();
			};
		}
	}, [remoteMediaClient]);

	return (
		<ThemedView
			style={{
				...playerStyle,
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
