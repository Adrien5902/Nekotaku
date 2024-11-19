import { DownloadingContext } from "@/components/DownloadingContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/Sizes";
import { useContext } from "react";
import { useToggle } from "../components/ToggleContext";
import EntryButton, {
	type Props as EntryButtonProps,
} from "@/components/Media/EntryButton";
import { RefreshControl, ScrollView } from "react-native";
import BigTitle from "@/components/BigTitle";
import DiskCache from "@/hooks/useDiskCache";
import type { MediaQuery } from "@/types/Anilist/graphql";

export default function DownloadedEpisodes() {
	const downloader = useContext(DownloadingContext);
	const { listsData } = useToggle();
	const {
		loading: cacheLoading,
		data: cacheData,
		error: cacheError,
	} = DiskCache.useAll<MediaQuery["Media"] | undefined>("media");
	const { data: lists, error: listsError, loading: listsLoading } = listsData;

	const error = cacheError || listsError;
	const loading = cacheLoading || listsLoading;

	if (error) {
		return (
			<ThemedView
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ThemedText>{error.message}</ThemedText>
			</ThemedView>
		);
	}

	const entries = lists?.flatMap((m) => m?.entries ?? []);
	const downloadedMediaIds = Object.keys(downloader.downloadedEpisodes);

	return (
		<ScrollView
			style={{ paddingTop: Spacing.xl }}
			refreshControl={<RefreshControl refreshing={loading} />}
		>
			<BigTitle icon={"folder-open"} title="Downloaded Episodes" />
			{downloadedMediaIds.length ? (
				downloadedMediaIds.map((mediaIdString) => {
					const mediaId = Number.parseInt(mediaIdString);

					const cachedMedia = cacheData?.find((media) => media?.id === mediaId);

					const entry = entries?.find(
						(mediaList) => mediaList?.media?.id === mediaId,
					) ?? {
						...cachedMedia?.mediaListEntry,
						media: cachedMedia,
					};

					if (!entry?.media) {
						return (
							<ThemedText>
								Error could not get media with id : {mediaId}
							</ThemedText>
						);
					}

					return (
						<EntryButton
							key={mediaId}
							media={entry?.media}
							mediaList={"status" in entry ? entry : undefined}
						/>
					);
				})
			) : (
				<ThemedText>No downloaded Episodes {":("}</ThemedText>
			)}
		</ScrollView>
	);
}
