import {
	type Media,
	MediaListStatus,
	type MutationSaveMediaListEntryArgs,
} from "@/types/Anilist/graphql";
import Icon from "./Icon";
import {
	Dimensions,
	Modal,
	ScrollView,
	TextInput,
	TouchableOpacity,
	View,
	type ViewStyle,
} from "react-native";
import { useRef, useState } from "react";
import { ThemedText } from "./ThemedText";
import { Spacing, TextSizes } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { SelectButtons } from "./SelectButtons";
import useStyles from "@/hooks/useStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useApolloClient, useMutation } from "@apollo/client";
import { gql } from "@/types/Anilist";
import type IconName from "@expo/vector-icons/build/FontAwesome";
import { useAnilistUserInfo } from "./AnilistUserInfoProvider";

export default function EditMediaListStatus({
	media,
	currentStatus,
	refetch,
}: {
	media: ModalProps["media"];
	currentStatus?: MutationSaveMediaListEntryArgs | null | undefined;
	refetch: () => void;
}) {
	const colors = useThemeColors();
	const styles = useStyles();

	const [modalVisible, setModalVisible] = useState(false);

	return modalVisible ? (
		<EditMediaListStatusModal
			{...{
				refetch,
				media,
				currentStatus,
				modalVisible,
				setModalVisible,
				styles,
				colors,
			}}
		/>
	) : (
		<Icon
			style={{
				padding: Spacing.l,
				backgroundColor: colors.accent,
				alignItems: "center",
				position: "absolute",
				borderRadius: Spacing.m,
				bottom: Spacing.xl,
				right: Spacing.xl,
			}}
			name="pencil"
			onPress={() => {
				setModalVisible(true);
			}}
		/>
	);
}

const QUERY = gql(`
	mutation Mutation(
	$mediaId: Int
	$score: Float
	$status: MediaListStatus
	$progress: Int
	$repeat: Int
	$private: Boolean
	$notes: String
	$hiddenFromStatusLists: Boolean
	$startedAt: FuzzyDateInput
	$completedAt: FuzzyDateInput
	$customLists: [String]
	) {
		SaveMediaListEntry(
			mediaId: $mediaId
			score: $score
			status: $status
			progress: $progress
			repeat: $repeat
			private: $private
			notes: $notes
			hiddenFromStatusLists: $hiddenFromStatusLists
			startedAt: $startedAt
			completedAt: $completedAt
			customLists: $customLists
		) {
			id
		}
	}
`);

interface ModalProps {
	media: Pick<Media, "isFavourite" | "id" | "title" | "episodes">;
	currentStatus?: MutationSaveMediaListEntryArgs | null | undefined;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	refetch: () => void;
}

function EditMediaListStatusModal({
	media,
	currentStatus,
	modalVisible,
	setModalVisible,
	refetch,
}: ModalProps) {
	const colors = useThemeColors();
	const styles = useStyles();

	const isFavourite = useRef(media.isFavourite);

	const newStatus = useRef<MutationSaveMediaListEntryArgs>({
		mediaId: media.id,
		status: currentStatus?.status,
		score: currentStatus?.score,
		repeat: currentStatus?.repeat,
		progress: currentStatus?.progress,
		private: currentStatus?.private,
		notes: currentStatus?.notes,
		hiddenFromStatusLists: currentStatus?.hiddenFromStatusLists,
		customLists: Object.keys(
			currentStatus?.customLists as unknown as Record<string, boolean>,
		).filter(
			(customList) =>
				(currentStatus?.customLists as unknown as Record<string, boolean>)[
					customList
				],
		),
		completedAt: {
			day: currentStatus?.completedAt?.day,
			month: currentStatus?.completedAt?.month,
			year: currentStatus?.completedAt?.year,
		},
		startedAt: {
			day: currentStatus?.startedAt?.day,
			month: currentStatus?.startedAt?.month,
			year: currentStatus?.startedAt?.year,
		},
	});

	const api = useApolloClient();

	async function save() {
		const status = newStatus.current;
		const result = await api.mutate({
			mutation: QUERY,
			variables: status,
		});
		result.data?.SaveMediaListEntry;
		setModalVisible(false);
		refetch();
	}

	return (
		<Modal
			visible={modalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => {
				setModalVisible(false);
			}}
		>
			<ScrollView
				onScrollEndDrag={(e) => {
					if (
						e.nativeEvent.contentOffset.y === 0 &&
						(e.nativeEvent.velocity?.y ?? 0) > 0
					) {
						setModalVisible(false);
					}
				}}
			>
				<View style={{ height: (Dimensions.get("screen").height * 2) / 3 }} />
				<ThemedView
					color="primary"
					style={{
						width: "100%",
						alignItems: "center",
						padding: Spacing.m,
						borderTopRightRadius: Spacing.m,
						borderTopLeftRadius: Spacing.m,
					}}
				>
					<ThemedText style={{ padding: Spacing.m }} size="m">
						{media?.title?.english}
					</ThemedText>
					<SelectButtons
						checkMark={true}
						buttons={
							Object.values(
								MediaListStatus,
							) as (typeof MediaListStatus)[keyof typeof MediaListStatus][]
						}
						defaultValue={newStatus.current.status ?? undefined}
						onValueChange={(value) => {
							newStatus.current.status = value;
						}}
					/>

					<PlusMinusNumberInput
						tilte="Episode Progress"
						defaultValue={currentStatus?.progress ?? 0}
						max={media.episodes ?? 1}
						min={0}
						onValueChange={(progress) => {
							newStatus.current.progress = progress;
						}}
					/>

					<PlusMinusNumberInput
						tilte="Score"
						defaultValue={currentStatus?.score ?? 0}
						max={10}
						min={0}
						onValueChange={(score) => {
							newStatus.current.score = score;
						}}
					/>

					<BooleanInput
						title="Favourite"
						activeIcon="heart"
						inactiveIcon="heart-o"
						defaultValue={media.isFavourite}
						onChange={(value) => {
							isFavourite.current = value;
						}}
					/>

					<PlusMinusNumberInput
						tilte="Total Rewatches"
						defaultValue={currentStatus?.repeat ?? 0}
						max={Number.MAX_VALUE}
						min={0}
						onValueChange={(repeat) => {
							newStatus.current.repeat = repeat;
						}}
					/>

					<BooleanInput
						title="Hidden from status list"
						defaultValue={currentStatus?.hiddenFromStatusLists ?? false}
						onChange={(value) => {
							newStatus.current.hiddenFromStatusLists = value;
						}}
					/>

					<BooleanInput
						title="Private"
						defaultValue={currentStatus?.private ?? false}
						onChange={(value) => {
							newStatus.current.private = value;
						}}
					/>

					{currentStatus?.customLists
						? Object.keys(currentStatus?.customLists).map(
								(customList: string) => (
									<BooleanInput
										defaultValue={
											(
												currentStatus?.customLists as unknown as Record<
													string,
													boolean
												>
											)?.[customList] ?? false
										}
										onChange={(value) => {
											if (value) {
												if (
													!newStatus.current.customLists?.includes(customList)
												) {
													newStatus.current.customLists?.push(customList);
												}
											} else {
												const index =
													newStatus.current.customLists?.indexOf(customList);
												if (index && index >= 0) {
													const lists = [
														...(newStatus.current.customLists ?? []),
													];
													lists.splice(index, 1);
													newStatus.current.customLists = lists;
												}
											}
										}}
										title={customList ?? ""}
										key={customList}
									/>
								),
							)
						: null}

					<View
						style={[
							styles.PrimaryElement,
							{
								borderColor: colors.text,
							},
						]}
					>
						<TextInput
							style={{ flex: 1 }}
							placeholderTextColor={`${colors.text}60`}
							cursorColor={colors.accent}
							defaultValue={newStatus.current.notes ?? undefined}
							onChange={(e) => {
								newStatus.current.notes = e.nativeEvent.text;
							}}
							placeholder="Notes..."
						/>
					</View>
					<View style={{ height: Spacing.xl * 3 }} />
				</ThemedView>
			</ScrollView>
			<ThemedView
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					padding: Spacing.s,
					backgroundColor: `${colors.background}aa`,
					position: "absolute",
					bottom: 0,
					width: "100%",
				}}
			>
				<TouchableOpacity activeOpacity={0.7}>
					<View style={[styles.PrimaryElement]}>
						<Icon
							name="trash"
							style={{ marginRight: Spacing.m }}
							color={colors.alert}
						/>
						<ThemedText size="m" color="alert">
							Delete
						</ThemedText>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => {
						save();
					}}
				>
					<View style={[styles.PrimaryElement]}>
						<Icon
							name="floppy-disk"
							style={{ marginRight: Spacing.m }}
							color={colors.accent}
						/>
						<ThemedText size="m" color="accent">
							Save
						</ThemedText>
					</View>
				</TouchableOpacity>
			</ThemedView>
		</Modal>
	);
}

interface PlusMinusNumberInputProps {
	onValueChange: (newVal: number) => unknown;
	onExceeded?: (moreOrLess: boolean) => unknown;
	min: number;
	max: number;
	defaultValue: number;
	style?: ViewStyle;
	tilte: string;
}

function PlusMinusNumberInput({
	onValueChange,
	onExceeded,
	min,
	max,
	defaultValue,
	style,
	tilte,
}: PlusMinusNumberInputProps) {
	const colors = useThemeColors();
	const styles = useStyles();

	const [currentValue, setCurrentValue] = useState(defaultValue);
	function checkValueInBounds(val: number): number {
		if (val > max) {
			if (onExceeded) onExceeded(true);
			return max;
		}
		if (val < min) {
			if (onExceeded) onExceeded(false);
			return min;
		}
		return val;
	}

	return (
		<ThemedView
			color="primary"
			style={[
				styles.PrimaryElement,
				{ borderColor: colors.text, flex: 1, padding: 0, overflow: "visible" },
				style,
			]}
		>
			<ThemedText
				style={{
					position: "absolute",
					paddingHorizontal: Spacing.m,
					backgroundColor: colors.primary,
					top: -Spacing.m,
					left: Spacing.m,
				}}
			>
				{tilte}
			</ThemedText>
			<Icon
				size={TextSizes.m}
				style={{ padding: Spacing.m, paddingRight: Spacing.xl }}
				name="minus"
				onPress={() => {
					setCurrentValue((current) => {
						const newVal = checkValueInBounds(current - 1);
						onValueChange(newVal);
						return newVal;
					});
				}}
			/>
			<TextInput
				keyboardType="numeric"
				cursorColor={colors.accent}
				defaultValue={currentValue.toString()}
				style={{ flex: 1, color: colors.text, textAlign: "center" }}
				onChange={(value) => {
					const inputVal = Number.parseInt(value.nativeEvent.text);
					if (value.nativeEvent.text && !Number.isNaN(inputVal)) {
						const newVal = checkValueInBounds(inputVal);
						onValueChange(newVal);
						setCurrentValue(newVal);
					}
				}}
			/>
			<Icon
				size={TextSizes.m}
				style={{ padding: Spacing.m, paddingLeft: Spacing.xl }}
				name="plus"
				onPress={() => {
					setCurrentValue((current) => {
						const newVal = checkValueInBounds(current + 1);
						onValueChange(newVal);
						return newVal;
					});
				}}
			/>
		</ThemedView>
	);
}

interface BooleanInputProps {
	defaultValue: boolean;
	onChange: (newVal: boolean) => unknown;
	activeIcon?: keyof (typeof IconName)["glyphMap"];
	inactiveIcon?: keyof (typeof IconName)["glyphMap"];
	title: string;
}

function BooleanInput({
	defaultValue,
	onChange,
	activeIcon,
	inactiveIcon,
	title,
}: BooleanInputProps) {
	const styles = useStyles();
	const colors = useThemeColors();
	const [isTrue, setIsTrue] = useState(defaultValue);

	return (
		<View
			style={[
				styles.PrimaryElement,
				{ flexDirection: "row", borderColor: colors.text, flex: 1 },
			]}
			onTouchEnd={() => {
				onChange(!isTrue);
				setIsTrue((t) => !t);
			}}
		>
			<ThemedText style={{ flex: 1 }}>{title}</ThemedText>
			<FontAwesome
				size={TextSizes.l}
				name={
					isTrue ? (activeIcon ?? "check-square") : (inactiveIcon ?? "square-o")
				}
				color={isTrue ? colors.accent : colors.text}
			/>
		</View>
	);
}
