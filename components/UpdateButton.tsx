import * as Updates from "expo-updates";
import { ActivityIndicator } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing } from "@/constants/Sizes";
import { useEffect } from "react";
import CustomButton from "./Button";
import React from "react";
import useLang from "@/hooks/useLang";

export default function UpdateButton() {
	const colors = useThemeColors();
	const lang = useLang();
	const {
		isUpdatePending,
		isDownloading,
		availableUpdate,
		checkError,
		downloadError,
		initializationError,
	} = Updates.useUpdates();

	useEffect(() => {
		if (isUpdatePending) {
			// Update has successfully downloaded; apply it now
			Updates.reloadAsync();
		}
	}, [isUpdatePending]);

	const error = checkError || downloadError || initializationError;
	const availableUpdateVersion =
		availableUpdate?.manifest &&
		"runtimeVersion" in availableUpdate.manifest &&
		availableUpdate.manifest.runtimeVersion;

	return (
		<CustomButton
			backgroundStyle={{ gap: Spacing.m }}
			backgroundColor={error ? "alert" : availableUpdate ? "accent" : "primary"}
			textSize="s"
			onPress={() => {
				if (!error) {
					if (availableUpdate && !isDownloading) {
						Updates.fetchUpdateAsync();
					}
				}
			}}
		>
			{error ? (
				error.message
			) : isDownloading ? (
				<>
					<ThemedText weight="bold">
						{lang.pages.settings.update.downloading}
					</ThemedText>
					<ActivityIndicator color={colors.text} />
				</>
			) : availableUpdate ? (
				lang.pages.settings.update.downloadLatest(`v${availableUpdateVersion}`)
			) : (
				lang.pages.settings.update.noneAvailable
			)}
		</CustomButton>
	);
}
