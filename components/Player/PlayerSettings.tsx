import { supportedLecteurs } from "@/hooks/useGetVideoSource";
import useLang from "@/hooks/useLang";
import { useThemeColors } from "@/hooks/useThemeColor";
import type { Lecteur } from "@/types/AnimeSama";
import Slider from "@react-native-community/slider";
import type React from "react";
import { useState } from "react";
import { View } from "react-native";
import { SelectButtons } from "../SelectButtons";
import { ThemedText } from "../ThemedText";
import usePlayerContext from "./PlayerContextProvider";

export function PlayerSettings({
	playbackSpeedRef,
	selectedLecteur,
	setSelectedLecteur,
}: {
	selectedLecteur: Lecteur | undefined;
	setSelectedLecteur:
		| React.Dispatch<React.SetStateAction<Lecteur | undefined>>
		| undefined;
	playbackSpeedRef: React.MutableRefObject<number>;
}) {
	const { episode, playerRef } = usePlayerContext();
	const colors = useThemeColors();
	const [playBackSpeed, setPlaybackSpeed] = useState(playbackSpeedRef.current);
	const lang = useLang();

	return (
		<View
			style={{
				alignSelf: "flex-start",
			}}
		>
			<ThemedText size="m">
				{lang.pages.player.settings.playBackSpeed} :{" "}
				{lang.pages.player.settings.playBackSpeedMultiplier(
					playBackSpeed.toFixed(2),
				)}
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
				buttons={[0.5, 1, 1.25, 1.5, 1.75, 2].map((n) => ({
					key: n.toString(),
					title: lang.pages.player.settings.playBackSpeedMultiplier(n),
				}))}
				defaultValue={playBackSpeed.toString()}
				onValueChange={(value) => {
					const n = Number.parseFloat(value);
					playerRef.current?.setPlaybackSpeedAsync(n);
					playbackSpeedRef.current = n;
					setPlaybackSpeed(n);
				}}
			/>

			<ThemedText size="m">
				{lang.pages.player.settings.selectedLecteur} :
			</ThemedText>
			<SelectButtons
				buttons={
					episode?.lecteurs
						.filter(
							(l, i) =>
								episode?.lecteurs.findIndex(
									(l2) => l2.hostname === l.hostname,
								) === i &&
								Object.keys(supportedLecteurs).find((l2) =>
									l.hostname.includes(l2),
								),
						)
						.map((l) => ({
							key: l.id.toString(),
							title: l.hostname,
						})) ?? []
				}
				defaultValue={selectedLecteur?.id.toString()}
				onValueChange={(value) => {
					const foundLecteur = episode?.lecteurs.find(
						(l) => l.id === Number.parseInt(value),
					);
					if (setSelectedLecteur && foundLecteur)
						setSelectedLecteur(foundLecteur);
				}}
			/>
		</View>
	);
}
