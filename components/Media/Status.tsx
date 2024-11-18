import { View } from "react-native";
import { ThemedText, type ThemedTextProps } from "../ThemedText";
import type { Media, MediaList} from "@/types/Anilist/graphql";

interface Props extends ThemedTextProps {
	mediaList?: Pick<MediaList, "status"> & {
		media?: Pick<Media, "format" | "status">|null|undefined
	}|null|undefined;
}

export default function MediaListStatusDisplay({ mediaList, ...props }: Props) {
	return (
		<View style={[{ flexDirection: "row" }]}>
			<ThemedText {...props}>{mediaList?.media?.format}</ThemedText>
			<ThemedText {...props}> • </ThemedText>
			<ThemedText {...props}>{mediaList?.media?.status}</ThemedText>
			<ThemedText {...props}> • </ThemedText>
			<ThemedText {...props}>{mediaList?.status}</ThemedText>
		</View>
	);
}
