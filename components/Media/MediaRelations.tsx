import type { MediaRelation } from "@/types/Anilist/graphql";
import EntryButton, { type Props as EntryButtonProps } from "./EntryButton";
import { ScrollView } from "react-native";
import useLang from "@/hooks/useLang";
import { ThemedText } from "../ThemedText";

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
	const lang = useLang();
	return nodes?.length ? (
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
	) : (
		<ThemedText style={{ flex: 1, textAlign: "center" }} weight="bold">
			{lang.pages.media.relations.noRelations}
		</ThemedText>
	);
}
