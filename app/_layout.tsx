import { Stack } from "expo-router";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useThemeColors } from "@/hooks/useThemeColor";
import DownloadingProvider, {
	Downloader,
} from "@/components/DownloadingContext";
import notifee from "@notifee/react-native";
import { ToggleProvider } from "@/components/ToggleContext";
import SettingsProvider from "@/components/Settings/Context";
import AnilistLoginProvider, {
	useAnilistToken,
} from "@/components/AnilistAccountProvider";
import AnilistUserInfoProvider from "@/components/AnilistUserInfoProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const downloader = new Downloader();

export default function RootLayout() {
	notifee.requestPermission();
	notifee.onBackgroundEvent(async (e) => {
		downloader.onEvent(e);
	});
	notifee.onForegroundEvent(async (e) => {
		downloader.onEvent(e);
	});

	return (
		<GestureHandlerRootView>
			<AnilistLoginProvider>
				<SettingsProvider>
					<DownloadingProvider downloader={downloader}>
						<StackScreens />
					</DownloadingProvider>
				</SettingsProvider>
			</AnilistLoginProvider>
		</GestureHandlerRootView>
	);
}

function StackScreens() {
	const colors = useThemeColors();

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
					cache: new InMemoryCache(),
				})
			}
		>
			<AnilistUserInfoProvider>
				<ToggleProvider>
					<Stack
						initialRouteName="(tabs)"
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
				</ToggleProvider>
			</AnilistUserInfoProvider>
		</ApolloProvider>
	);
}
