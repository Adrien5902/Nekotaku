import {
	type Media,
	MediaListStatus,
	type MutationSaveMediaListEntryArgs,
} from "@/types/Anilist/graphql";
import Icon from "./Icon";
import {
	Dimensions,
	Modal as ReactModal,
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
import { useApolloClient } from "@apollo/client";
import { gql } from "@/types/Anilist";
import { BooleanInput } from "./BooleanInput";
import Modal, { type ModalState } from "./Modal";
import { GET_MEDIA_QUERY } from "@/types/MediaList";
import useLang from "@/hooks/useLang";

export default function EditMediaListStatus({
	media,
	currentStatus,
	refetch,
	mediaListId,
}: {
	media: ModalProps["media"];
	currentStatus?: MutationSaveMediaListEntryArgs | null | undefined;
	refetch: () => void;
	mediaListId: ModalProps["mediaListId"];
}) {
	const colors = useThemeColors();
	const styles = useStyles();

	const [modalVisible, setModalVisible] = useState(false);

	return modalVisible ? (
		<EditMediaListStatusModal
			{...{
				mediaListId,
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
			name={currentStatus ? "pencil" : "plus"}
			onPress={() => {
				setModalVisible(true);
			}}
		/>
	);
}

const DELETE_ENTRY_QUERY = gql(`
	mutation DeleteMediaListEntry($deleteMediaListEntryId: Int) {
		DeleteMediaListEntry(id: $deleteMediaListEntryId) {
			deleted
		}
	}
`);

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
	mediaListId: number | undefined;
}

function EditMediaListStatusModal({
	media,
	currentStatus,
	modalVisible,
	setModalVisible,
	refetch,
	mediaListId,
}: ModalProps) {
	const colors = useThemeColors();
	const styles = useStyles();
	const lang = useLang();

	const isFavourite = useRef(media.isFavourite);

	const customLists = currentStatus?.customLists as unknown as
		| Record<string, boolean>
		| undefined;

	const newStatus = useRef<MutationSaveMediaListEntryArgs>({
		mediaId: media.id,
		status: currentStatus?.status,
		score: currentStatus?.score,
		repeat: currentStatus?.repeat,
		progress: currentStatus?.progress,
		private: currentStatus?.private,
		notes: currentStatus?.notes,
		hiddenFromStatusLists: currentStatus?.hiddenFromStatusLists,
		customLists: customLists
			? Object.keys(customLists).filter((customList) => customLists[customList])
			: undefined,
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

	const deleteModal = useRef<ModalState>(null);

	return (
		<ReactModal
			visible={modalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => {
				setModalVisible(false);
			}}
		>
			<Modal
				title={lang.pages.editMediaListStatus.deleteConfirm}
				buttons={[
					{
						title: lang.pages.editMediaListStatus.delete,
						color: "alert",
						async onPress() {
							await api.mutate({
								mutation: DELETE_ENTRY_QUERY,
								variables: {
									deleteMediaListEntryId: mediaListId,
								},
								refetchQueries: [GET_MEDIA_QUERY],
							});
							deleteModal.current?.setVisible(false);
							setModalVisible(false);
						},
					},
				]}
				closeButton={lang.misc.cancel}
				ref={deleteModal}
			/>
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
						buttons={Object.values(MediaListStatus).map((status) => ({
							key: status,
							title: lang.Anilist.MediaListStatus[status],
						}))}
						defaultValue={newStatus.current.status ?? undefined}
						onValueChange={(value) => {
							newStatus.current.status = value;
						}}
					/>

					<PlusMinusNumberInput
						tilte={lang.pages.editMediaListStatus.episodeProgress}
						defaultValue={currentStatus?.progress ?? 0}
						max={media.episodes ?? 1}
						min={0}
						onValueChange={(progress) => {
							newStatus.current.progress = progress;
						}}
					/>

					<PlusMinusNumberInput
						tilte={lang.pages.editMediaListStatus.score}
						defaultValue={currentStatus?.score ?? 0}
						max={10}
						min={0}
						onValueChange={(score) => {
							newStatus.current.score = score;
						}}
					/>

					<BooleanInput
						title={lang.pages.editMediaListStatus.favorite}
						activeIcon="heart"
						inactiveIcon="heart-o"
						defaultValue={media.isFavourite}
						onChange={(value) => {
							isFavourite.current = value;
						}}
					/>

					<PlusMinusNumberInput
						tilte={lang.pages.editMediaListStatus.totalRewatches}
						defaultValue={currentStatus?.repeat ?? 0}
						max={Number.MAX_VALUE}
						min={0}
						onValueChange={(repeat) => {
							newStatus.current.repeat = repeat;
						}}
					/>

					<BooleanInput
						title={lang.pages.editMediaListStatus.hidden}
						defaultValue={currentStatus?.hiddenFromStatusLists ?? false}
						onChange={(value) => {
							newStatus.current.hiddenFromStatusLists = value;
						}}
					/>

					<BooleanInput
						title={lang.pages.editMediaListStatus.private}
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
							placeholder={lang.pages.editMediaListStatus.notesPlaceHolder}
						/>
					</View>
					<View style={{ height: Spacing.xxl }} />
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
				{/* Do no display delete button if the user never saved the media list */}
				{mediaListId ? (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							deleteModal.current?.setVisible(true);
						}}
					>
						<View style={[styles.PrimaryElement]}>
							<Icon
								name="trash"
								style={{ marginRight: Spacing.m }}
								color={colors.alert}
							/>
							<ThemedText size="m" color="alert">
								{lang.pages.editMediaListStatus.delete}
							</ThemedText>
						</View>
					</TouchableOpacity>
				) : null}
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
							{lang.pages.editMediaListStatus.save}
						</ThemedText>
					</View>
				</TouchableOpacity>
			</ThemedView>
		</ReactModal>
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
			<ThemedText style={styles.topTextDescriptor}>{tilte}</ThemedText>
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
