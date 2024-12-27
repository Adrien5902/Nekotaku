import Icon from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing, TextSizes } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";
import { millisToTimeStamp } from "@/types/Player";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import {
	View,
	ActivityIndicator,
	TouchableWithoutFeedback,
} from "react-native";
import GoogleCast, { useDevices } from "react-native-google-cast";
import usePlayerContext from "../PlayerContextProvider";
import { useControlsContext } from "./useControlsContext";

export function PoppingControls({
	children,
}: {
	viewControls: boolean;
	children: JSX.Element;
}) {
	const {
		playerRef,
		media,
		episode,
		loading,
		setSettingsVisible,
		isFullscreen,
		toggleFullscreen,
	} = usePlayerContext();

	const { currentStatus, shouldDisplayControls } = useControlsContext();
	const SessionManager = GoogleCast.getSessionManager();
	const devices = useDevices();
	const colors = useThemeColors();

	return (
		<>
			{shouldDisplayControls && episode ? (
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
							{media?.title?.english ?? media?.title?.romaji} -{" "}
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
						<Icon
							name="gear"
							size={TextSizes.m}
							color={Colors.dark.text}
							style={{ marginRight: Spacing.m, padding: Spacing.m }}
							onPress={() => {
								setSettingsVisible((s) => !s);
							}}
						/>
					</LinearGradient>
				</>
			) : null}
			{children}
			{shouldDisplayControls ? (
				<>
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
									maximumTrackTintColor={Colors.dark.text}
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
		</>
	);
}
