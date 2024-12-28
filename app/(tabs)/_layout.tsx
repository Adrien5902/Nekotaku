import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";
import Icon from "@/components/Icon";
import { useToggle } from "@/components/ToggleContext";
import { MediaType } from "@/types/Anilist/graphql";
import useLang from "@/hooks/useLang";

export default function TabLayout() {
	const { appMode } = useToggle();
	const lang = useLang();

	return (
		<Tabs
			tabBar={(props) => <CustomTabBar {...props} />}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: lang.pages.tabBar.list(appMode),
					tabBarIcon: ({ color }) => (
						<Icon
							name={appMode === MediaType.Manga ? "book-open" : "film"}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: lang.pages.tabBar.explore,
					tabBarIcon: ({ color }) => <Icon name="compass" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: lang.pages.tabBar.me,
					tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
