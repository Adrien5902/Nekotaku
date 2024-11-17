import React from "react";
import { TouchableOpacity, StyleSheet, Switch, View } from "react-native";
import type {
	NavigationHelpers,
	ParamListBase,
	TabNavigationState,
} from "@react-navigation/native";
import type { EdgeInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useToggle } from "@/components/ToggleContext";
import * as NavigationBar from "expo-navigation-bar";
import { useThemeColors } from "@/hooks/useThemeColor";

type BottomTabBarProps = {
	state: TabNavigationState<ParamListBase>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	descriptors: Record<string, any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	navigation: NavigationHelpers<ParamListBase, any>;
	insets: EdgeInsets;
};

export default function CustomTabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const colors = useThemeColors();
	const { isManga, setIsManga } = useToggle();
	NavigationBar.setBackgroundColorAsync(colors.primary);

	return (
		<ThemedView
			style={[styles.container, { borderColor: colors.primary }]}
			color="primary"
		>
			<View style={styles.tabsContainer}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const isFocused = state.index === index;

					const onPress = () => {
						if (!isFocused) {
							navigation.navigate(route.name);
						}
					};

					return (
						<TouchableOpacity
							key={route.name}
							onPress={onPress}
							style={styles.tabButton}
						>
							{options.tabBarIcon?.({
								color: isFocused ? colors.accent : colors.text,
								size: 24,
							})}
							<ThemedText
								style={{
									color: isFocused ? colors.accent : colors.text,
								}}
							>
								{options.title}
							</ThemedText>
						</TouchableOpacity>
					);
				})}
			</View>

			<View style={styles.switchContainer}>
				<ThemedText>{`${isManga ? "Manga" : "Anime"} `}</ThemedText>
				<Switch
					value={isManga}
					onValueChange={() => {
						if (setIsManga) {
							setIsManga((prev) => !prev);
						}
					}}
				/>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderTopWidth: 1,
	},
	tabsContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-around",
	},
	tabButton: {
		alignItems: "center",
		padding: 10,
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
	},
});
