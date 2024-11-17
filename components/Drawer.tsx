import {
	Animated,
	ScrollView,
	Text,
	TextInput,
	TouchableHighlight,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useRef, useState } from "react";
import type { MediaListGroup } from "@/types/Anilist";
import Icon from "./Icon";
import { Spacing } from "@/constants/Sizes";

export default function Drawer({
	lists,
	listStatus,
	setListStatus,
}: {
	lists: MediaListGroup[] | undefined;
	listStatus: number | undefined;
	setListStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
	const colors = useThemeColors();
	const [drawerOpened, setDrawerOpen] = useState(false);
	const drawerHeightAnim = useRef(new Animated.Value(0)).current;

	const toggleDrawer = () => {
		setDrawerOpen((prev) => !prev);
		Animated.timing(drawerHeightAnim, {
			toValue: drawerOpened ? 0 : 500,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	return (
		<ThemedView
			color="primary"
			style={{
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
				borderBottomWidth: Spacing.xs,
				borderColor: colors.background,
			}}
		>
			<View
				style={{
					width: "100%",
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					flexDirection: "row",
					justifyContent: "space-between",
					padding: 10,
				}}
			>
				{/* TODO : search feature */}
				<TextInput
					style={[
						{
							flex: 1,
							borderRadius: 10,
							marginRight: 10,
							fontSize: 16,
							padding: 10,
						},
						{ backgroundColor: colors.background },
					]}
					placeholderTextColor={colors.text}
					placeholder="Search..."
				/>
				<TouchableWithoutFeedback onPress={toggleDrawer}>
					<ThemedView
						color="background"
						style={{
							justifyContent: "center",
							alignItems: "center",
							padding: 10,
							borderRadius: 10,
							aspectRatio: 1,
						}}
					>
						<Icon name={drawerOpened ? "xmark" : "bars"} />
					</ThemedView>
				</TouchableWithoutFeedback>
			</View>
			<Animated.View
				style={[
					{
						overflow: "hidden",
					},
					{ maxHeight: drawerHeightAnim },
				]}
			>
				<ScrollView
					style={{
						flex: 1,
						paddingHorizontal: 10,
					}}
				>
					{lists?.map((list, i) => {
						const isFocused = i === listStatus;
						return (
							<TouchableHighlight
								underlayColor={colors.primary}
								key={list.name}
								onPress={(e) => {
									setListStatus(i);
									toggleDrawer();
								}}
								style={{
									backgroundColor: isFocused ? colors.accent : undefined,
									borderRadius: 10,
									margin: 2,
								}}
							>
								<ThemedText
									numberOfLines={1}
									style={{
										paddingHorizontal: 20,
										paddingVertical: 8,
									}}
									weight={isFocused ? "bold" : undefined}
									color={isFocused ? "background" : "text"}
								>
									{list.name}
								</ThemedText>
							</TouchableHighlight>
						);
					})}
				</ScrollView>
			</Animated.View>
		</ThemedView>
	);
}
