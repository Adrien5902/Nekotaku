import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";
import Icon from "@/components/Icon";
import { useToggle } from "@/components/ToggleContext";

export default function TabLayout() {
	const { isManga } = useToggle();
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
					title: "List",
					tabBarIcon: ({ color }) => (
						<Icon name={isManga ? "book-open" : "film"} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => <Icon name="compass" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Me",
					tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
