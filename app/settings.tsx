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
import {
	type SupportedLecteurs,
	supportedLecteurs,
} from "@/hooks/useGetVideoSource";
import useLang from "@/hooks/useLang";
import { MediaType } from "@/types/Anilist/graphql";
import { ScrollView, View } from "react-native";
import Constants from "expo-constants";
import UpdateButton from "@/components/UpdateButton";

export default function Settings() {
	const lang = useLang();
	return (
		<View style={{ paddingTop: Spacing.xl, flex: 1 }}>
			<BigTitle icon={"gears"} title={lang.pages.settings.tilte} />
			<CustomTabView
				scenes={[
					{
						component: <AppWorkSettings />,
						icon: "wrench",
						key: "work",
					},
					{
						component: <AppearanceSettings />,
						icon: "palette",
						key: "appearance",
					},
					{
						component: <AccountSettings />,
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
	const lang = useLang();

	return (
		<ScrollView>
			<View>
				<ThemedText style={{ padding: Spacing.m }}>
					{lang.settings.defaultMode} :
				</ThemedText>
				<SelectButtons
					buttons={Object.values(MediaType).map((type) => ({
						key: type,
						title: lang.Anilist.MediaType[type],
						icon: type === MediaType.Anime ? "film" : "book-open",
					}))}
					onValueChange={(value) => {
						setSettings((s) => ({ ...s, defaultMode: value }));
					}}
					defaultValue={settings.defaultMode}
				/>
			</View>

			<View>
				<ThemedText style={{ padding: Spacing.m }}>
					{lang.settings.preferredLecteur} :
				</ThemedText>

				<SelectButtons
					buttons={Object.keys(supportedLecteurs).map((l) => ({
						key: l,
						title: l,
					}))}
					defaultValue={settings.preferredLecteur}
					onValueChange={(value) =>
						setSettings((s) => ({
							...s,
							preferredLecteur: value as SupportedLecteurs,
						}))
					}
				/>
			</View>

			<BooleanInput
				defaultValue={settings.offlineMode}
				onChange={(value) => setSettings((s) => ({ ...s, offlineMode: value }))}
				title={lang.settings.offlineMode}
			/>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<ThemedText style={{ opacity: 0.7, margin: Spacing.l }}>
					{lang.settings.appVersion(`v${Constants.expoConfig?.version}`)}
				</ThemedText>
				<UpdateButton />
			</View>
		</ScrollView>
	);
}

function AppearanceSettings() {
	const settings = useSettings();
	const setSettings = useSetSettings();
	const lang = useLang();
	if (!setSettings) return null;

	return (
		<ScrollView>
			<View>
				<ThemedText style={{ padding: Spacing.m }}>
					{lang.settings.lang} :
				</ThemedText>
				<SelectButtons
					buttons={Object.values(Lang).map((l, i) => ({
						key: l,
						title: lang.settings.langs[l],
					}))}
					onValueChange={(value) => {
						setSettings((s) => ({ ...s, lang: value }));
					}}
					defaultValue={settings.lang}
				/>
			</View>

			<View>
				<ThemedText style={{ padding: Spacing.m }}>
					{lang.settings.colorTheme} :
				</ThemedText>
				<ThemedView>
					<SelectButtons
						buttons={Object.values(ColorTheme).map((theme) => ({
							key: theme,
							title: lang.settings.themes[theme],
							icon:
								theme === ColorTheme.Light
									? "sun"
									: theme === ColorTheme.Dark
										? "moon"
										: "wrench",
						}))}
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
	const lang = useLang();
	return (
		<ScrollView>
			<ThemedText style={{ margin: Spacing.l }} size="m">
				{lang.pages.settings.account.loggedInAs} : {data?.name}
			</ThemedText>
			<CustomButton
				onPress={() => {
					if (logout) {
						logout();
					}
				}}
				backgroundColor="alert"
			>
				{lang.pages.settings.account.logout}
			</CustomButton>
		</ScrollView>
	);
}
