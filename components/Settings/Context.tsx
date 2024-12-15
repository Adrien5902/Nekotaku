import { createContext, useContext, useEffect, useState } from "react";
import { DefaultSettings, type Settings } from "./types";
import * as FileSystem from "expo-file-system";
import { usePromise } from "@/hooks/usePromise";
import { useNetworkState } from "expo-network";

const SETTINGS_FILE_NAME = "settings.json";
const SETTINGS_LOCATION = FileSystem.documentDirectory + SETTINGS_FILE_NAME;

export const SettingsContext = createContext(DefaultSettings);
export const ChangeSettingsContext = createContext<
	React.Dispatch<React.SetStateAction<Settings>> | undefined
>(undefined);

export default function SettingsProvider({
	children,
}: { children: React.ReactNode }) {
	const NetworkState = useNetworkState();
	const { data, loading } = usePromise(async () => {
		return JSON.parse(await FileSystem.readAsStringAsync(SETTINGS_LOCATION));
	});

	const [settings, setSettings] = useState(DefaultSettings);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (data) setSettings({ ...data, offlineMode: !NetworkState.isConnected });
	}, [data]);

	useEffect(() => {
		(async () => {
			try {
				const json = JSON.stringify(settings);
				await FileSystem.writeAsStringAsync(SETTINGS_LOCATION, json);
			} catch (error) {
				// TODO: handle error
			}
		})();
	}, [settings]);

	if (loading) return null;

	return (
		<SettingsContext.Provider value={settings}>
			<ChangeSettingsContext.Provider value={setSettings}>
				{children}
			</ChangeSettingsContext.Provider>
		</SettingsContext.Provider>
	);
}

export const useSettings = () => useContext(SettingsContext);
export const useSetSettings = () => useContext(ChangeSettingsContext);
