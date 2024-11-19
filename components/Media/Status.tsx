import { View } from "react-native";
import { ThemedText, type ThemedTextProps } from "../ThemedText";
import type { Media, MediaList } from "@/types/Anilist/graphql";

interface Props extends ThemedTextProps {
	mediaList?: Pick<MediaList, "status"> | null | undefined;
	media?: Pick<Media, "format" | "status"> | null | undefined;
}

export default function MediaListStatusDisplay({
	mediaList,
	media,
	...props
}: Props) {
	return (
		<View style={[{ flexDirection: "row" }]}>
			<ThemedText {...props}>{media?.format}</ThemedText>
			<ThemedText {...props}> • </ThemedText>
			<ThemedText {...props}>{media?.status}</ThemedText>
			{mediaList?.status ? (
				<>
					<ThemedText {...props}> • </ThemedText>
					<ThemedText {...props}>{mediaList?.status}</ThemedText>
				</>
			) : null}
		</View>
	);
}
