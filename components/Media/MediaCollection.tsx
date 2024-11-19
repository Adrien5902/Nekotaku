import { ThemedView } from "@/components/ThemedView";
import EntryButton, { type Props as EntryButtonProps } from "./EntryButton";
import { RefreshControl, VirtualizedList } from "react-native";

interface Props {
	refreshing: boolean;
	refresh: () => unknown;
	list?:
		| (
				| (EntryButtonProps["mediaList"] & {
						media?: EntryButtonProps["media"];
				  })
				| null
				| undefined
		  )[]
		| null
		| undefined;
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
				getItem={(_, index) => list?.[index]}
				renderItem={({ item }) =>
					item ? <EntryButton mediaList={item} media={item.media} /> : null
				}
				keyExtractor={(entry, _index) => entry?.media?.id.toString() ?? ""}
				getItemCount={() => list?.length ?? 0}
				style={{
					width: "100%",
				}}
			/>
		</ThemedView>
	);
}
