import { createContext, useContext } from "react";
import { DefaultSettings } from "./types";
import * as FileSystem from "expo-file-system";
import { usePromise } from "@/hooks/usePromise";

const SettingsLocation = `${FileSystem.documentDirectory}settings.json`;

export const SettingsContext = createContext(DefaultSettings);

export default function SettingsProvider({
	children,
}: { children: React.ReactNode }) {
	const { data } = usePromise(async () => {
		return JSON.parse(await FileSystem.readAsStringAsync(SettingsLocation));
	});

	return (
		<SettingsContext.Provider value={data ?? DefaultSettings}>
			{children}
		</SettingsContext.Provider>
	);
}

export const useSettings = () => useContext(SettingsContext);
