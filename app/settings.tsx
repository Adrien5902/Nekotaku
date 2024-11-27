import { useAnilistToken } from "@/components/AnilistAccountProvider";
import BigTitle from "@/components/BigTitle";
import CustomButton from "@/components/Button";
import CustomTabView from "@/components/CustomTabView";
import { SelectButtons } from "@/components/SelectButtons";
import { useSetSettings, useSettings } from "@/components/Settings/Context";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/Sizes";
import { View } from "react-native";

export default function Settings() {
	return (
		<View style={{ paddingTop: Spacing.xl, flex: 1 }}>
			<BigTitle icon={"gears"} title="Settings" />
			<CustomTabView
				scenes={[
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

function AppearanceSettings() {
	const settings = useSettings();
	const setSettings = useSetSettings();
	if (!setSettings) return null;
	return (
		<>
			<View>
				<ThemedText>{settings.lang}</ThemedText>
			</View>
			<SelectButtons
				buttons={["light", "dark", "system"]}
				onValueChange={(value) => {
					setSettings((s) => ({ ...s, colorTheme: value }));
				}}
				defaultValue={settings.colorTheme}
			/>
			<View>
				<ThemedText>{settings.colorTheme}</ThemedText>
			</View>
		</>
	);
}

function AccountSettings() {
	const { logout } = useAnilistToken() ?? {};
	return (
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
	);
}
