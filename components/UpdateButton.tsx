import * as Updates from "expo-updates";
import { ActivityIndicator } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing } from "@/constants/Sizes";
import { useEffect, useState } from "react";
import CustomButton from "./Button";
import React from "react";
import useLang from "@/hooks/useLang";

export default function UpdateButton() {
	const colors = useThemeColors();
	const lang = useLang();
	const {
		isChecking,
		isUpdateAvailable,
		isUpdatePending,
		isDownloading,
		availableUpdate,
		checkError,
		downloadError,
		initializationError,
	} = Updates.useUpdates();

	const [checked, setChecked] = useState(false);

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
			backgroundColor={
				error
					? "alert"
					: (checked || isChecking) && !isUpdateAvailable
						? "primary"
						: "accent"
			}
			textSize="s"
			onPress={() => {
				if (!error && !isDownloading) {
					if (isUpdateAvailable) {
						Updates.fetchUpdateAsync();
					} else {
						Updates.checkForUpdateAsync();
						setChecked(true);
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
			) : isUpdateAvailable ? (
				lang.pages.settings.update.downloadLatest(
					availableUpdateVersion ? `v${availableUpdateVersion}` : undefined,
				)
			) : isChecking ? (
				<>
					<ThemedText weight="bold">
						{lang.pages.settings.update.checking}
					</ThemedText>
					<ActivityIndicator color={colors.text} />
				</>
			) : checked ? (
				lang.pages.settings.update.noneAvailable
			) : (
				lang.pages.settings.update.checkAvailability
			)}
		</CustomButton>
	);
}
