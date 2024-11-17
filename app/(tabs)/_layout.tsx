import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";
import Icon from "@/components/Icon";

export default function TabLayout() {
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
					tabBarIcon: ({ color }) => <Icon name="film" color={color} />,
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
