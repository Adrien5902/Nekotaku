import {
	Animated,
	ScrollView,
	TextInput,
	TouchableHighlight,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useRef, useState } from "react";
import type { MediaListGroup } from "@/types/Anilist/graphql";
import Icon from "./Icon";
import { Spacing } from "@/constants/Sizes";
import type { Entry } from "@/app/(tabs)";
import {
	searchFriendly,
	searchFriendlyMediaNames,
} from "@/hooks/useAnimeSamaSearch";

type ListsType =
	| (Pick<MediaListGroup, "name" | "status"> | undefined | null)[]
	| undefined
	| null;

export interface Props {
	lists?: ListsType;
	listStatus: number | undefined;
	setFilterEntries: React.Dispatch<
		React.SetStateAction<((entry: Entry) => boolean) | undefined>
	>;
	setListStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function Drawer({
	lists,
	listStatus,
	setListStatus,
	setFilterEntries,
}: Props) {
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
				<TextInput
					style={[
						{
							color: colors.text,
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
					onChange={(event) => {
						const searchStr = searchFriendly(event.nativeEvent.text);
						if (searchStr) {
							setFilterEntries(
								() => (entry: Entry) =>
									searchFriendlyMediaNames(entry?.media)
										.map((s) => s.includes(searchStr))
										.reduce((prev, curr) => prev || curr),
							);
						} else {
							setFilterEntries(undefined);
						}
					}}
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
								key={list?.name}
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
									{list?.name}
								</ThemedText>
							</TouchableHighlight>
						);
					})}
				</ScrollView>
			</Animated.View>
		</ThemedView>
	);
}
