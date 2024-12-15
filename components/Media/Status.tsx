import { View } from "react-native";
import { ThemedText, type ThemedTextProps } from "../ThemedText";
import {
	type AiringSchedule,
	MediaFormat,
	type Media,
	type MediaList,
	MediaListStatus,
} from "@/types/Anilist/graphql";
import useLang from "@/hooks/useLang";

export interface Props extends ThemedTextProps {
	mediaList?: Pick<MediaList, "status" | "progress"> | null | undefined;
	media?:
		| (Pick<Media, "format" | "status"> & {
				nextAiringEpisode?:
					| Pick<AiringSchedule, "episode" | "timeUntilAiring">
					| undefined
					| null;
		  })
		| null
		| undefined;
}

export default function MediaListStatusDisplay({
	mediaList,
	media,
	...props
}: Props) {
	const lang = useLang();

	const texts: (string | JSX.Element)[] = [
		lang.Anilist.MediaFormat[media?.format ?? MediaFormat.Tv],
		media?.status ? lang.Anilist.MediaStatus[media.status] : "",
	];

	if (mediaList?.status) {
		texts.push(lang.Anilist.MediaListStatus[mediaList.status]);

		if (
			mediaList?.status === MediaListStatus.Current &&
			typeof mediaList.progress === "number" &&
			media?.nextAiringEpisode?.episode
		) {
			const numberOfReleasedEpisodes = media.nextAiringEpisode.episode - 1;

			const upToDate = (mediaList.progress ?? 0) === numberOfReleasedEpisodes;

			const numberOfEpisodesBehind =
				numberOfReleasedEpisodes - mediaList.progress;

			const daysBeforeNextEp =
				media.nextAiringEpisode.timeUntilAiring / 3600 / 24;
			const hours = (media.nextAiringEpisode.timeUntilAiring / 3600) % 24;
			const min = (media.nextAiringEpisode.timeUntilAiring / 60) % 60;

			texts.push(
				<ThemedText style={{ flex: 1 }} {...props} color="accent">
					{upToDate
						? lang.misc.statusDisplay.nextEpIn(
								daysBeforeNextEp > 1,
								Math.ceil(daysBeforeNextEp),
								Math.floor(hours),
								Math.ceil(min),
							)
						: lang.misc.statusDisplay.late(numberOfEpisodesBehind)}
				</ThemedText>,
			);
		}
	}

	return (
		<View>
			<ThemedText style={{ flex: 1 }}>
				{texts.flatMap((element, i) => {
					const arr = [];

					if (i !== 0) {
						arr.push(" • ");
					}
					arr.push(element);

					return arr;
				})}
			</ThemedText>
		</View>
	);
}
