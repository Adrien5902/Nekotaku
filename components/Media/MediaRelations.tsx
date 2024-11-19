import type { MediaRelation } from "@/types/Anilist/graphql";
import { ThemedView } from "../ThemedView";
import EntryButton, { type Props as EntryButtonProps } from "./EntryButton";
import { ScrollView } from "react-native";

export interface Props {
	nodes?:
		| {
				relationType?: MediaRelation | null | undefined;
				media?: EntryButtonProps["media"];
				mediaList?: EntryButtonProps["mediaList"];
		  }[]
		| null
		| undefined;
}

export default function MediaRelations({ nodes }: Props) {
	return (
		<ScrollView>
			{nodes?.map((relation) => {
				return (
					<EntryButton
						key={relation.media?.id}
						mediaList={relation.mediaList}
						media={relation.media}
						relationType={relation.relationType}
					/>
				);
			})}
		</ScrollView>
	);
}
