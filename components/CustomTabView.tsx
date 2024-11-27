import { Spacing, TextSizes } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import {
	type NavigationState,
	type Route,
	SceneMap,
	type SceneRendererProps,
	TabBar,
	type TabDescriptor,
	TabView,
} from "react-native-tab-view";
import Icon, { type IconName } from "./Icon";
import { ThemedText } from "./ThemedText";

export interface Props {
	scenes: {
		icon: string;
		component: React.ComponentType<unknown>;
		key: string;
	}[];
}

export default function CustomTabView({ scenes }: Props) {
	const colors = useThemeColors();
	const [index, setIndex] = useState(0);

	const renderScene = ({ route }: { route: Route }) => {
		const scene = scenes.find((s) => s.key === route.key);
		return scene ? <scene.component /> : null;
	};

	const [routes] = useState<Route[]>(scenes);

	const renderTabBar: (
		props: SceneRendererProps & {
			navigationState: NavigationState<Route>;
			options: Record<string, TabDescriptor<Route>> | undefined;
		},
	) => React.ReactNode = (props) => (
		<TabBar
			{...props}
			indicatorStyle={{
				backgroundColor: colors.accent,
				height: Spacing.s,
				paddingHorizontal: Spacing.l,
				borderTopLeftRadius: Spacing.m,
				borderTopRightRadius: Spacing.m,
			}}
			style={{
				backgroundColor: "transparent",
				borderBottomWidth: Spacing.xs,
				borderColor: colors.primary,
			}}
			renderTabBarItem={({ route }) => {
				const routeIndex = routes.findIndex((r) => r.key === route.key);
				return (
					<View
						style={{
							paddingVertical: Spacing.m,
							width: Dimensions.get("window").width / routes.length,
							alignItems: "center",
						}}
						onTouchStart={() => setIndex(routeIndex)}
					>
						<Icon name={route.icon as IconName} size={TextSizes.l} />
					</View>
				);
			}}
			activeColor={colors.accent}
			inactiveColor={colors.text}
		/>
	);

	return (
		<TabView
			renderTabBar={renderTabBar}
			onIndexChange={setIndex}
			renderScene={renderScene}
			navigationState={{ index, routes }}
		/>
	);
}
