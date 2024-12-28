import Icon from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing, TextSizes } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";
import { millisToTimeStamp } from "@/types/Player";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import GoogleCast, { useDevices } from "react-native-google-cast";
import usePlayerContext from "../PlayerContextProvider";
import { useControlsContext } from "./useControlsContext";
import { router } from "expo-router";

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
		episodes,
	} = usePlayerContext();

	const { currentStatus, shouldDisplayControls } = useControlsContext();
	const SessionManager = GoogleCast.getSessionManager();
	const devices = useDevices();
	const colors = useThemeColors();

	const fullscreenMultiplier = isFullscreen ? 1.5 : 1;

	const style = StyleSheet.create({
		middleIcon: {
			padding: Spacing.m * fullscreenMultiplier,
			borderRadius: Spacing.m * fullscreenMultiplier,
			textAlign: "center",
		},
	});

	const middleIconProps = {
		style: style.middleIcon,
		size: TextSizes.xxl * fullscreenMultiplier,
		color: Colors.dark.text,
	};

	const hasPreviousEp = episode?.id !== undefined && episode.id > 0;
	const hasNextEp =
		episode?.id !== undefined && episode.id < episodes.length - 1;

	return (
		<>
			{/* Upper half */}

			{/* Top part */}
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
								fontSize: TextSizes.s * fullscreenMultiplier,
							}}
						>
							{media?.title?.english ?? media?.title?.romaji} -{" "}
							{typeof episode.name === "number"
								? `Ep. ${episode.name}`
								: episode.name}
						</ThemedText>
						<Icon
							name="chromecast"
							size={TextSizes.m * fullscreenMultiplier}
							color={Colors.dark.text}
							style={{
								marginRight: Spacing.m,
								padding: Spacing.m * fullscreenMultiplier,
							}}
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
			{/* In between */}
			{children}

			{/* Bottom half */}
			{shouldDisplayControls ? (
				<>
					{/* Middle buttons */}
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							width: "80%",
							alignItems: "center",
							justifyContent: "space-around",
						}}
					>
						{
							<Icon
								onPress={() => {
									if (hasPreviousEp)
										router.setParams({ episodeId: episode.id - 1 });
								}}
								name={"backward-step"}
								{...middleIconProps}
								style={{
									...middleIconProps.style,
									opacity: Number(hasPreviousEp),
								}}
							/>
						}
						{loading ? (
							<ActivityIndicator size="large" color={Colors.dark.text} />
						) : (
							<Icon
								onPress={() => {
									if (currentStatus?.isPlaying) {
										playerRef.current?.pauseAsync();
									} else {
										playerRef.current?.playAsync();
									}
								}}
								name={currentStatus?.isPlaying ? "pause" : "play"}
								{...middleIconProps}
							/>
						)}
						<Icon
							onPress={() => {
								if (hasNextEp) router.setParams({ episodeId: episode.id + 1 });
							}}
							name={"forward-step"}
							{...middleIconProps}
							style={{
								...middleIconProps.style,
								opacity: Number(hasNextEp),
							}}
						/>
					</View>

					{/* Bottom bar */}
					<LinearGradient
						colors={["#00000000", "#000000ff"]}
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
							alignItems: "center",
							padding: Spacing.m * fullscreenMultiplier,
						}}
					>
						{currentStatus?.durationMillis ? (
							<>
								<View>
									<ThemedText
										style={{
											color: Colors.dark.text,
											fontSize: TextSizes.s * fullscreenMultiplier,
										}}
									>
										{millisToTimeStamp(currentStatus.positionMillis)}/
										{millisToTimeStamp(currentStatus.durationMillis)}
									</ThemedText>
								</View>

								<Slider
									style={{
										flex: 1,
										marginHorizontal: Spacing.s * fullscreenMultiplier,
									}}
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
							size={TextSizes.m * fullscreenMultiplier}
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
