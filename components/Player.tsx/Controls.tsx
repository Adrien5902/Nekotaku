import type { AVPlaybackStatusSuccess, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Easing,
	TouchableWithoutFeedback,
	useAnimatedValue,
	View,
	type ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, TextSizes } from "@/constants/Sizes";
import type { MediaList } from "@/types/Anilist/graphql";
import type { Episode } from "@/types/AnimeSama";
import Icon from "../Icon";
import GoogleCast, { useDevices } from "react-native-google-cast";
import useStyles from "@/hooks/useStyles";
import type { PlayerFunctions, VideoPlayStatus } from "@/types/Player";

export default function Controls({
	statusRef,
	isFullscreen,
	loading,
	episode,
	mediaList,
	playerRef,
	toggleFullscreen,
	forceView,
}: {
	playerRef: React.RefObject<PlayerFunctions | undefined>;
	statusRef: React.MutableRefObject<VideoPlayStatus | undefined>;
	loading: boolean;
	isFullscreen: boolean;
	episode: Episode;
	mediaList: MediaList;
	toggleFullscreen: (force?: boolean) => void;
	forceView?: boolean;
}) {
	const styles = useStyles();
	const colors = useThemeColors();

	const [viewControls, setViewControls] = useState(true);
	const [currentStatus, setCurrentStatus] = useState(
		statusRef.current ?? undefined,
	);

	const forwardGradientContainerRef = useRef<View>(null);
	const forwardGradientOpactityAnim = useAnimatedValue(0);
	const [rightOrLeft, setRightOrLeft] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			if (statusRef.current) {
				setCurrentStatus({ ...statusRef.current });
			}
		}, 500);

		return () => clearInterval(interval);
	}, [statusRef]);

	const millisToTimeStamp = (millis: number) => {
		const s = Math.floor(millis / 1000);
		const hours = Math.floor(s / (60 * 60));
		const minutes = Math.floor(s / 60) % 60;
		const seconds = s % 60;
		const paddingZero = (n: number) => (n < 10 ? `0${n}` : n.toString());
		const display = (n: number) => (n !== 0 ? `${paddingZero(n)}:` : "");

		return `${display(hours)}${paddingZero(minutes)}:${paddingZero(seconds)}`;
	};

	const timer = useRef<NodeJS.Timeout | null>();
	const TIMEOUT = 500;
	const debounce = (onSingle: () => void, onDouble: () => void) => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
			onDouble();
		} else {
			timer.current = setTimeout(() => {
				timer.current = null;
			}, TIMEOUT);
		}
		onSingle();
	};

	const timeChangeInterval = 10_000;
	const SessionManager = GoogleCast.getSessionManager();
	const devices = useDevices();

	return (
		<>
			<TouchableWithoutFeedback
				onPress={(e) => {
					debounce(
						() => {
							if (viewControls) {
								setTimeout(() => setViewControls(false), 6000);
							}
							setViewControls((c) => !c);
						},
						() => {
							const { locationX } = e.nativeEvent;
							const { width } = Dimensions.get("screen");
							const rightOrLeft = locationX / width > 0.5;
							setRightOrLeft(rightOrLeft);

							Animated.timing(forwardGradientOpactityAnim, {
								toValue: 1,
								duration: 150,
								easing: Easing.ease,
								useNativeDriver: true,
							}).start();
							setTimeout(() => {
								Animated.timing(forwardGradientOpactityAnim, {
									toValue: 0,
									duration: 500,
									easing: Easing.quad,
									useNativeDriver: true,
								}).start();
							}, 150);

							playerRef.current?.setPositionAsync(
								(statusRef.current?.positionMillis ?? 0) +
									timeChangeInterval * (rightOrLeft ? 1 : -1),
							);
						},
					);
				}}
			>
				<View
					style={{
						...(isFullscreen ? styles.fullscreenVideo : styles.video),
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
						position: "absolute",
						flex: 1,
						zIndex: 2,
					}}
				>
					{loading || viewControls || forceView ? (
						<>
							<LinearGradient
								colors={["#000000ff", "#00000000"]}
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									width: "100%",
								}}
							>
								<ThemedText
									numberOfLines={1}
									style={{
										color: Colors.dark.text,
										flex: 1,
										paddingLeft: Spacing.m,
									}}
								>
									{mediaList.media?.title?.english} -{" "}
									{typeof episode.name === "number"
										? `Ep. ${episode.name}`
										: episode.name}
								</ThemedText>
								<Icon
									name="chromecast"
									size={TextSizes.m}
									color={Colors.dark.text}
									style={{ marginRight: Spacing.m, padding: Spacing.m }}
									onPress={async () => {
										if (devices[0]) {
											SessionManager.startSession(devices[0].deviceId);
										}
									}}
								/>
							</LinearGradient>

							<View
								style={{
									flex: 1,
									justifyContent: "center",
								}}
							>
								{loading ? (
									<ActivityIndicator size="large" color={Colors.dark.text} />
								) : (
									<TouchableWithoutFeedback
										onPress={() => {
											if (currentStatus?.isPlaying) {
												playerRef.current?.pauseAsync();
											} else {
												playerRef.current?.playAsync();
											}
										}}
									>
										<View
											style={{
												padding: Spacing.m,
												borderRadius: Spacing.xl,
												aspectRatio: 1,
												alignItems: "center",
											}}
										>
											<Icon
												name={currentStatus?.isPlaying ? "pause" : "play"}
												size={TextSizes.xxl}
												color={Colors.dark.text}
											/>
										</View>
									</TouchableWithoutFeedback>
								)}
							</View>

							<LinearGradient
								colors={["#00000000", "#000000ff"]}
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									alignItems: "center",
									padding: Spacing.m,
								}}
							>
								{currentStatus?.durationMillis ? (
									<>
										<View>
											<ThemedText style={{ color: Colors.dark.text }}>
												{millisToTimeStamp(currentStatus.positionMillis)}/
												{millisToTimeStamp(currentStatus.durationMillis)}
											</ThemedText>
										</View>

										<Slider
											style={{ flex: 1, marginHorizontal: 4, height: 10 }}
											onValueChange={(value) => {
												playerRef.current?.setPositionAsync(value);
											}}
											value={currentStatus.positionMillis}
											maximumValue={currentStatus.durationMillis}
											thumbTintColor={colors.accent}
											minimumTrackTintColor={colors.accent}
											maximumTrackTintColor={Colors.light.text}
										/>
									</>
								) : (
									<View style={{ flex: 1 }} />
								)}
								<Icon
									name={isFullscreen ? "compress" : "expand"}
									color={Colors.dark.text}
									size={TextSizes.m}
									onPress={() => {
										toggleFullscreen();
									}}
								/>
							</LinearGradient>
						</>
					) : null}
				</View>
			</TouchableWithoutFeedback>

			<Animated.View
				style={{
					...(isFullscreen ? styles.fullscreenVideo : styles.video),
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					position: "absolute",
					flex: 1,
					zIndex: 3,
					opacity: forwardGradientOpactityAnim,
					pointerEvents: "none",
				}}
				ref={forwardGradientContainerRef}
			>
				<LinearGradient
					colors={["#000000ff", "#000000cc", "#00000000"]}
					start={{ x: rightOrLeft ? 1 : 0, y: 1 }}
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: rightOrLeft ? "flex-end" : "flex-start",
					}}
				>
					<View
						style={{
							position: "absolute",
							padding: Spacing.xl * 2,
							alignItems: "center",
						}}
					>
						<Icon
							name={rightOrLeft ? "forward" : "backward"}
							size={TextSizes.xl}
							color={Colors.dark.text}
						/>
						<ThemedText style={{ color: Colors.dark.text }} weight="bold">
							{timeChangeInterval / 1000}s
						</ThemedText>
					</View>
					<View style={{ flex: 1 }} />
				</LinearGradient>
			</Animated.View>
		</>
	);
}
