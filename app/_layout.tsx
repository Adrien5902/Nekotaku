import { type Href, router, Stack } from "expo-router";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useThemeColors } from "@/hooks/useThemeColor";
import DownloadingProvider, {
	Downloader,
} from "@/components/DownloadingContext";
import notifee from "@notifee/react-native";
import { ToggleProvider } from "@/components/ToggleContext";
import SettingsProvider, { useSettings } from "@/components/Settings/Context";
import AnilistLoginProvider, {
	useAnilistToken,
} from "@/components/AnilistAccountProvider";
import AnilistUserInfoProvider from "@/components/AnilistUserInfoProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";

export default function RootLayout() {
	return (
		<GestureHandlerRootView>
			<SettingsProvider>
				<DownloadingProvider>
					<AnilistLoginProvider>
						<Providers>
							<StackScreens />
						</Providers>
					</AnilistLoginProvider>
				</DownloadingProvider>
			</SettingsProvider>
		</GestureHandlerRootView>
	);
}

function Providers({ children }: { children: React.ReactNode }) {
	const { token } = useAnilistToken() ?? {};

	if (!token) return null;

	return (
		<ApolloProvider
			client={
				new ApolloClient({
					uri: "https://graphql.anilist.co",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					cache: new InMemoryCache({
						typePolicies: {
							MediaCoverImage: {
								keyFields: ["large"],
							},
						},
					}),
				})
			}
		>
			<AnilistUserInfoProvider>
				<ToggleProvider>{children}</ToggleProvider>
			</AnilistUserInfoProvider>
		</ApolloProvider>
	);
}

function StackScreens() {
	const colors = useThemeColors();
	const settings = useSettings();

	const defaultRoute: Href<string> = "/(tabs)";
	const offlineRoute: Href<string> = "/downloaded-episodes";

	const route = settings.offlineMode ? offlineRoute : defaultRoute;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (router.canDismiss()) {
			router.dismissAll();
		}
		router.replace(route);
	}, [settings.offlineMode]);

	return (
		<Stack
			initialRouteName={route}
			screenOptions={{
				contentStyle: { backgroundColor: colors.background },
			}}
		>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="media_details/[id]"
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="player" options={{ headerShown: false }} />
			<Stack.Screen name="settings" options={{ headerShown: false }} />
			<Stack.Screen
				name="downloaded-episodes"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
}
