import { StyleSheet, View } from "react-native";
import {
	type MediaCollectionData,
	useToggle,
} from "../../components/ToggleContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MediaListCollection from "@/components/Media/MediaCollection";
import { useState } from "react";
import Drawer from "@/components/Drawer";
import { Spacing } from "@/constants/Sizes";

export type Entry = NonNullable<
	NonNullable<MediaCollectionData[number]>["entries"]
>[number];

export default function ListScreen() {
	const { listsData } = useToggle();
	const { data: lists, error, loading, refetch } = listsData;

	const [listStatus, setListStatus] = useState<number>(0);
	const [filterEntries, setFilterEntries] =
		useState<(entry: Entry) => boolean>();

	const list =
		lists && listStatus !== undefined ? lists[listStatus] : undefined;
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
				filterEntries={filterEntries}
				entries={list?.entries}
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
