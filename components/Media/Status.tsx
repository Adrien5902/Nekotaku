import { View } from "react-native";
import { ThemedText, type ThemedTextProps } from "../ThemedText";
import {
	MediaFormat,
	type Media,
	type MediaList,
} from "@/types/Anilist/graphql";
import useLang from "@/hooks/useLang";

interface Props extends ThemedTextProps {
	mediaList?: Pick<MediaList, "status"> | null | undefined;
	media?: Pick<Media, "format" | "status"> | null | undefined;
}

export default function MediaListStatusDisplay({
	mediaList,
	media,
	...props
}: Props) {
	const lang = useLang();

	return (
		<View style={[{ flexDirection: "row" }]}>
			<ThemedText {...props}>
				{lang.Anilist.MediaFormat[media?.format ?? MediaFormat.Tv]}
			</ThemedText>
			<ThemedText {...props}> • </ThemedText>
			<ThemedText {...props}>
				{media?.status ? lang.Anilist.MediaStatus[media.status] : ""}
			</ThemedText>
			{mediaList?.status ? (
				<>
					<ThemedText {...props}> • </ThemedText>
					<ThemedText {...props}>
						{lang.Anilist.MediaListStatus[mediaList.status]}
					</ThemedText>
				</>
			) : null}
		</View>
	);
}
