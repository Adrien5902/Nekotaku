import { ThemedView } from "@/components/ThemedView";
import EntryButton, { type Props as EntryButtonProps } from "./EntryButton";
import { RefreshControl, VirtualizedList } from "react-native";
import BigTitle from "../BigTitle";
import type { Entry } from "@/app/(tabs)";

interface Props {
	refreshing: boolean;
	refresh: () => unknown;
	entries?:
		| (
				| (EntryButtonProps["mediaList"] & {
						media?: EntryButtonProps["media"];
				  })
				| null
				| undefined
		  )[]
		| null
		| undefined;
	filterEntries: ((entry: Entry) => boolean) | undefined;
}

export default function MediaListCollection({
	refreshing,
	refresh,
	entries,
	filterEntries,
}: Props) {
	const filteredEntries = filterEntries
		? (entries as Entry[])?.filter(filterEntries)
		: entries;

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
				ListHeaderComponent={
					refreshing || entries?.length ? null : filterEntries ? (
						<BigTitle icon="face-frown" title="No results for your search" />
					) : (
						<BigTitle icon="face-frown" title="No medias in this category" />
					)
				}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
				}
				initialNumToRender={6}
				getItem={(_, index) => entries?.[index]}
				renderItem={({ item }) =>
					item ? <EntryButton mediaList={item} media={item.media} /> : null
				}
				keyExtractor={(entry, _index) => entry?.media?.id.toString() ?? ""}
				getItemCount={() => filteredEntries?.length ?? 0}
				style={{
					width: "100%",
				}}
			/>
		</ThemedView>
	);
}
