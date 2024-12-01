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
import { Spacing, TextSizes } from "@/constants/Sizes";
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
	setListStatus: React.Dispatch<React.SetStateAction<number>>;
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
				borderTopLeftRadius: Spacing.m,
				borderTopRightRadius: Spacing.m,
				borderBottomWidth: Spacing.xs,
				borderColor: colors.background,
			}}
		>
			<View
				style={{
					width: "100%",
					borderTopLeftRadius: Spacing.m,
					borderTopRightRadius: Spacing.m,
					flexDirection: "row",
					justifyContent: "space-between",
					padding: Spacing.m,
				}}
			>
				<SearchBar setFilterEntries={setFilterEntries} />
				<TouchableWithoutFeedback onPress={toggleDrawer}>
					<ThemedView
						color="background"
						style={{
							justifyContent: "center",
							alignItems: "center",
							padding: Spacing.m,
							borderRadius: Spacing.m,
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
						paddingHorizontal: Spacing.m,
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
									borderRadius: Spacing.m,
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

function SearchBar({ setFilterEntries }: Pick<Props, "setFilterEntries">) {
	const [searchValue, setSearchValue] = useState<string>();
	const [clearTextVisible, setClearTextVisible] = useState(false);
	const colors = useThemeColors();

	return (
		<ThemedView
			style={{
				flex: 1,
				marginRight: Spacing.m,
				padding: Spacing.m,
				borderRadius: Spacing.m,
				justifyContent: "center",
			}}
		>
			<TextInput
				style={{
					color: colors.text,
					fontSize: TextSizes.m,
				}}
				placeholderTextColor={colors.text}
				placeholder="Search..."
				value={searchValue}
				onChange={(event) => {
					const searchStr = searchFriendly(event.nativeEvent.text);
					if (searchStr) {
						setClearTextVisible(true);
						setFilterEntries(
							() => (entry: Entry) =>
								searchFriendlyMediaNames(entry?.media)
									.map((s) => s.includes(searchStr))
									.reduce((prev, curr) => prev || curr),
						);
					} else {
						setClearTextVisible(false);
						setFilterEntries(undefined);
					}
				}}
			/>
			{clearTextVisible ? (
				<ThemedView
					color="text"
					style={{
						position: "absolute",
						borderRadius: Spacing.xl,
						aspectRatio: 1,
						width: Spacing.l * 1.5,
						justifyContent: "center",
						alignItems: "center",
						right: Spacing.m,
					}}
					onTouchEnd={() => {
						setFilterEntries(undefined);
						setSearchValue("");
						setClearTextVisible(false);
						setTimeout(() => {
							setSearchValue(undefined);
						});
					}}
				>
					<Icon name="xmark" color={colors.background} size={TextSizes.m} />
				</ThemedView>
			) : null}
		</ThemedView>
	);
}
