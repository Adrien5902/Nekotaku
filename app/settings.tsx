import { useAnilistToken } from "@/components/AnilistAccountProvider";
import { useAnilistUserInfo } from "@/components/AnilistUserInfoProvider";
import BigTitle from "@/components/BigTitle";
import { BooleanInput } from "@/components/BooleanInput";
import CustomButton from "@/components/Button";
import CustomTabView from "@/components/CustomTabView";
import { SelectButtons } from "@/components/SelectButtons";
import { useSetSettings, useSettings } from "@/components/Settings/Context";
import { ColorTheme, Lang } from "@/components/Settings/types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/Sizes";
import { MediaType } from "@/types/Anilist/graphql";
import { ScrollView, View } from "react-native";

export default function Settings() {
	return (
		<View style={{ paddingTop: Spacing.xl, flex: 1 }}>
			<BigTitle icon={"gears"} title="Settings" />
			<CustomTabView
				scenes={[
					{
						component: () => <AppWorkSettings />,
						icon: "wrench",
						key: "work",
					},
					{
						component: () => <AppearanceSettings />,
						icon: "palette",
						key: "appearance",
					},
					{
						component: () => <AccountSettings />,
						icon: "user",
						key: "account",
					},
				]}
			/>
			<View style={{ height: Spacing.xl }} />
		</View>
	);
}

function AppWorkSettings() {
	const settings = useSettings();
	const setSettings = useSetSettings();
	if (!setSettings) return null;

	return (
		<ScrollView>
			<View>
				<ThemedText style={{ padding: Spacing.m }}>
					Default app mode :{" "}
				</ThemedText>
				<SelectButtons
					buttons={[
						{ key: MediaType.Anime, title: "Anime", icon: "film" },
						{ key: MediaType.Manga, title: "Manga", icon: "book-open" },
					]}
					onValueChange={(value) => {
						setSettings((s) => ({ ...s, defaultMode: value }));
					}}
					defaultValue={settings.defaultMode}
				/>
			</View>

			<BooleanInput
				defaultValue={settings.offlineMode}
				onChange={(value) => setSettings((s) => ({ ...s, offlineMode: value }))}
				title="Offline Mode"
			/>
		</ScrollView>
	);
}

function AppearanceSettings() {
	const settings = useSettings();
	const setSettings = useSetSettings();
	if (!setSettings) return null;

	return (
		<ScrollView>
			<View>
				<ThemedText style={{ padding: Spacing.m }}>App lang :</ThemedText>
				<SelectButtons
					buttons={Object.values(Lang).map((lang, i) => ({
						key: lang,
						title: Object.keys(Lang)[i],
					}))}
					onValueChange={(value) => {
						setSettings((s) => ({ ...s, lang: value }));
					}}
					defaultValue={settings.lang}
				/>
			</View>

			<View>
				<ThemedText style={{ padding: Spacing.m }}>Theme :</ThemedText>
				<ThemedView>
					<SelectButtons
						buttons={[
							{ key: ColorTheme.Light, title: "Light", icon: "sun" },
							{ key: ColorTheme.Dark, title: "Dark", icon: "moon" },
							{ key: ColorTheme.System, title: "System", icon: "wrench" },
						]}
						onValueChange={(value) => {
							setSettings((s) => ({ ...s, colorTheme: value }));
						}}
						defaultValue={settings.colorTheme}
					/>
				</ThemedView>
			</View>
		</ScrollView>
	);
}

function AccountSettings() {
	const { logout } = useAnilistToken() ?? {};
	const { data } = useAnilistUserInfo() ?? {};
	return (
		<ScrollView>
			<ThemedText style={{ margin: Spacing.l }} size="m">
				Logged in as : {data?.name}
			</ThemedText>
			<CustomButton
				onPress={() => {
					if (logout) {
						logout();
					}
				}}
				backgroundColor="alert"
			>
				Logout
			</CustomButton>
		</ScrollView>
	);
}
