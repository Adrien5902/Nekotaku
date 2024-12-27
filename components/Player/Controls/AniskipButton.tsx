import CustomButton from "@/components/Button";
import useAniskip from "@/hooks/useAniskip";
import type { Episode } from "@/types/AnimeSama";
import React from "react";
import { View } from "react-native";
import usePlayerContext from "../PlayerContextProvider";
import { useControlsContext } from "./useControlsContext";

export function AniskipButton() {
	const { playerRef, episode, media } = usePlayerContext();
	const { currentStatus, shouldDisplayControls } = useControlsContext();
	const { data: dataAniskip } = useAniskip(
		media,
		currentStatus?.durationMillis,
		// there's no reason for this to be undefined
		episode as Episode,
	);
	const positionSecs = (currentStatus?.positionMillis ?? 0) / 1000;

	return (
		<View style={{ width: "100%", alignItems: "flex-end" }}>
			{dataAniskip?.map((aniskip) => {
				if (
					positionSecs > aniskip.interval.startTime &&
					(shouldDisplayControls
						? positionSecs < aniskip.interval.endTime
						: positionSecs < aniskip.interval.startTime + 10)
				) {
					return (
						<CustomButton
							key={aniskip.skipType}
							onPress={() => {
								playerRef.current?.setPositionAsync(
									aniskip.interval.endTime * 1000,
								);
							}}
							textColor="background"
							backgroundColor="text"
						>
							{`Skip ${aniskip.skipType}`}
						</CustomButton>
					);
				}
			})}
		</View>
	);
}
