import { useAnilistToken } from "@/components/AnilistAccountProvider";
import BigTitle from "@/components/BigTitle";
import CustomButton from "@/components/Button";
import { Collapsible } from "@/components/Collapsible";
import Icon from "@/components/Icon";
import { useSettings } from "@/components/Settings/Context";
import { ThemedText } from "@/components/ThemedText";
import { Spacing, TextSizes } from "@/constants/Sizes";
import { ScrollView, View } from "react-native";

export default function Settings() {
	const { logout } = useAnilistToken() ?? {};
	const settings = useSettings();
	return (
		<ScrollView style={{ paddingTop: Spacing.xl }}>
			<BigTitle icon={"gears"} title="Setting" />
			<Collapsible title="Appearance">
				<View>
					<ThemedText>{settings.lang}</ThemedText>
				</View>
				<View>
					<ThemedText>{settings.colorTheme}</ThemedText>
				</View>
			</Collapsible>
			<Collapsible title="Account">
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
			</Collapsible>
			<View style={{ height: Spacing.xl }} />
		</ScrollView>
	);
}
