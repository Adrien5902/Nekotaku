import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import WebView from "react-native-webview";

const clientId = "22442";
const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
const SecureStoreTokenLocation = "anilist_access_token";

const AnilistLoginContext = createContext<{
	token: string | null;
	logout: () => void;
} | null>(null);

interface Props {
	children: React.ReactNode;
}

export default function AnilistLoginProvider({ children }: Props) {
	const [token, setToken] = useState<string | null | undefined>();

	useEffect(() => {
		const initToken = SecureStore.getItem(SecureStoreTokenLocation);
		if (initToken) {
			setToken(initToken);
		} else {
			setToken(null);
		}
	}, []);

	async function logout() {
		await SecureStore.deleteItemAsync(SecureStoreTokenLocation);
		setToken(null);
	}

	return (
		<AnilistLoginContext.Provider value={{ token: token ?? null, logout }}>
			{token === null ? <Login setToken={setToken} /> : children}
		</AnilistLoginContext.Provider>
	);
}

export const useAnilistToken = () => useContext(AnilistLoginContext);

function Login({
	setToken,
}: {
	setToken: React.Dispatch<React.SetStateAction<string | undefined | null>>;
}) {
	return (
		<WebView
			incognito={true}
			style={{ flex: 1 }}
			source={{ uri: authUrl }}
			onNavigationStateChange={(e) => {
				const url = new URL(e.url.replace("#", "?"));
				const token = url.searchParams.get("access_token");
				if (token) {
					SecureStore.setItem(SecureStoreTokenLocation, token);
					setToken(token);
				}
				return;
			}}
		/>
	);
}
