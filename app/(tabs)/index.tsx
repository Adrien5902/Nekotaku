import { StyleSheet, Text } from "react-native";
import {
	type MediaCollectionData,
	useToggle,
} from "../../components/ToggleContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MediaListCollection from "@/components/Media/MediaCollection";
import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import { Spacing } from "@/constants/Sizes";

export type Entry = NonNullable<
	NonNullable<MediaCollectionData[number]>["entries"]
>[number];

export default function ListScreen() {
	const { listsData } = useToggle();
	const { data: lists, error, loading, refetch } = listsData;

	const [listStatus, setListStatus] = useState<number>();
	const [filterEntries, setFilterEntries] =
		useState<(entry: Entry) => boolean>();

	const list =
		lists && listStatus !== undefined ? lists[listStatus] : undefined;
	const entries = filterEntries
		? (list?.entries ?? lists?.[0]?.entries)?.filter(filterEntries)
		: (list?.entries ?? lists?.[0]?.entries);

	console.log(filterEntries);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (listStatus === undefined && lists) {
			setListStatus(
				lists?.findIndex((list) => list?.status === "CURRENT") ?? 0,
			);
		}
	}, [loading]);

	if (error) {
		return (
			<ThemedView
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ThemedText>{error.message}</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<MediaListCollection
				entries={entries}
				refreshing={loading}
				refresh={refetch}
			/>
			<Drawer {...{ lists, listStatus, setListStatus, setFilterEntries }} />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: Spacing.xl,
	},
});
