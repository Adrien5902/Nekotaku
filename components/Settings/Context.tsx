import { createContext, useContext, useState } from "react";
import { DefaultSettings, type Settings } from "./types";
import * as FileSystem from "expo-file-system";
import { usePromise } from "@/hooks/usePromise";

const SETTINGS_FILE_NAME = "settings.json";
const SETTINGS_LOCATION = FileSystem.documentDirectory + SETTINGS_FILE_NAME;

export const SettingsContext = createContext(DefaultSettings);
export const ChangeSettingsContext = createContext<
	React.Dispatch<React.SetStateAction<Settings>> | undefined
>(undefined);

export default function SettingsProvider({
	children,
}: { children: React.ReactNode }) {
	const { data } = usePromise(async () => {
		return JSON.parse(await FileSystem.readAsStringAsync(SETTINGS_LOCATION));
	});

	const [settings, setSettings] = useState(data ?? DefaultSettings);

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
