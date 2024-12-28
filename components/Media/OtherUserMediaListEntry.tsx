import useStyles from "@/hooks/useStyles";
import { ThemedView } from "../ThemedView";
import type {
	Media,
	MediaList,
	User,
	UserAvatar,
} from "@/types/Anilist/graphql";
import { Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { Spacing, TextSizes } from "@/constants/Sizes";
import useLang from "@/hooks/useLang";
import DotSeparatedText from "../DotSeparatedText";
import Icon from "../Icon";
import React from "react";

export interface Props {
	media: Pick<Media, "episodes">;
	mediaList?:
		| (Pick<MediaList, "status" | "progress" | "score"> & {
				user?:
					| (Pick<User, "name"> & {
							avatar?: Pick<UserAvatar, "large"> | undefined | null;
					  })
					| undefined
					| null;
		  })
		| undefined
		| null;
}

export default function OtherUserMediaListEntry({ mediaList, media }: Props) {
	const styles = useStyles();
	const lang = useLang();

	const texts = [];
	if (mediaList?.status) {
		texts.push(lang.Anilist.MediaListStatus[mediaList.status]);
	}
	if (mediaList?.score) {
		texts.push(
			<ThemedText key="progress">
				<ThemedText>{`${mediaList.score}/10`}</ThemedText>{" "}
				<Icon name="star-half-stroke" size={TextSizes.s} />
			</ThemedText>,
		);
	}
	if (
		mediaList?.progress &&
		media?.episodes &&
		mediaList?.progress < media?.episodes
	) {
		texts.push(
			<ThemedText key="progress">
				<ThemedText>{`${mediaList.progress}/${media.episodes}`}</ThemedText>{" "}
				<Icon name="list-check" size={TextSizes.s} />
			</ThemedText>,
		);
	}

	return (
		<ThemedView
			style={[
				styles.PrimaryElement,
				{ justifyContent: "flex-start", padding: 0 },
			]}
		>
			<Image
				source={{ uri: mediaList?.user?.avatar?.large ?? undefined }}
				style={{ height: 80, aspectRatio: 1 }}
			/>

			<ThemedView style={{ padding: Spacing.m }}>
				<ThemedText size="m" style={{ flex: 1 }}>
					{mediaList?.user?.name}
				</ThemedText>
				<DotSeparatedText style={{ opacity: 0.7 }} texts={texts} />
			</ThemedView>
		</ThemedView>
	);
}
