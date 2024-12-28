import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
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
import { useDoublePress } from "@/hooks/useDoublePress";
import { MediaType } from "@/types/Anilist/graphql";
import { Spacing } from "@/constants/Sizes";

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
	const { setAppMode } = useToggle();
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

					const onPress = useDoublePress(
						() => {
							if (!isFocused) {
								navigation.navigate(route.name);
							}
						},
						route.name === "index"
							? () => {
									if (setAppMode)
										setAppMode((mode) =>
											mode === MediaType.Anime
												? MediaType.Manga
												: MediaType.Anime,
										);
								}
							: undefined,
					);

					return (
						<TouchableOpacity
							key={route.name}
							onPress={onPress}
							style={styles.tabButton}
						>
							{options.tabBarIcon?.({
								color: isFocused ? colors.accent : colors.text,
								size: Spacing.xl,
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
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.m,
		paddingVertical: Spacing.s,
		borderTopWidth: Spacing.xs,
	},
	tabsContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-around",
	},
	tabButton: {
		flex: 1,
		alignItems: "center",
		padding: Spacing.m,
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.m,
	},
});
