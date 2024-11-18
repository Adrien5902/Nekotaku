import { StyleSheet, Text } from "react-native";
import { useToggle } from "../../components/ToggleContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MediaListCollection from "@/components/Media/MediaCollection";
import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import { Spacing } from "@/constants/Sizes";

export default function ListScreen() {
	const { listsData, isManga } = useToggle();
	const { data: lists, error, loading, refetch } = listsData;

	const [listStatus, setListStatus] = useState<number | undefined>();
	const list =
		lists && listStatus !== undefined ? lists[listStatus] : undefined;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (listStatus === undefined && lists) {
			setListStatus(lists?.findIndex((list) => list?.status === "CURRENT") ?? 0);
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
				list={list?.entries ?? lists?.[0]?.entries}
				refreshing={loading}
				refresh={refetch}
			/>
			<Drawer {...{ lists, listStatus, setListStatus }} />
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
