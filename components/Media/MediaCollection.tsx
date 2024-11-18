import { ThemedView } from "@/components/ThemedView";
import EntryButton from "./EntryButton";
import type { MediaListGroup } from "@/types/Anilist/graphql";
import { RefreshControl, VirtualizedList } from "react-native";

interface Props {
	refreshing: boolean;
	refresh: () => unknown;
	list?: MediaListGroup;
}

export default function MediaListCollection({
	refreshing,
	refresh,
	list,
}: Props) {
	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
			}}
		>
			<VirtualizedList
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
				}
				initialNumToRender={6}
				getItem={(_, index) => list?.entries?.[index]}
				renderItem={({ item }) => (item ? <EntryButton entry={item} /> : null)}
				keyExtractor={(entry, _index) => entry?.id.toString() ?? ""}
				getItemCount={() => list?.entries?.length ?? 0}
				style={{
					width: "100%",
				}}
			/>
		</ThemedView>
	);
}
