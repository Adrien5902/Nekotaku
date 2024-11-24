import { DownloadingContext } from "@/components/DownloadingContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useContext } from "react";
import { useToggle } from "../components/ToggleContext";
import BigTitle from "@/components/BigTitle";
import DiskCache from "@/hooks/useDiskCache";
import type { MediaQuery } from "@/types/Anilist/graphql";
import MediaListCollection from "@/components/Media/MediaCollection";
import { Spacing } from "@/constants/Sizes";
import { useNetworkState } from "expo-network";

export default function DownloadedEpisodes() {
	const downloader = useContext(DownloadingContext);
	const { listsData } = useToggle();
	const {
		loading: cacheLoading,
		data: cacheData,
		error: cacheError,
	} = DiskCache.useAll<MediaQuery["Media"] | undefined>("media");
	const {
		data: lists,
		error: listsError,
		loading: listsLoading,
		refetch,
	} = listsData;

	const networkState = useNetworkState();

	const error = cacheError || listsError;
	const loading =
		cacheLoading || (networkState.isConnected ? listsLoading : false);

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
	const downloadedMediaEntries = Object.keys(downloader.downloadedEpisodes).map(
		(mediaIdString) => {
			const mediaId = Number.parseInt(mediaIdString);

			const cachedMedia = cacheData?.find((media) => media?.id === mediaId);

			return (
				entries?.find((mediaList) => mediaList?.media?.id === mediaId) ?? {
					...cachedMedia?.mediaListEntry,
					media: cachedMedia,
				}
			);
		},
	);

	return (
		<ThemedView style={{ paddingTop: Spacing.xl, flex: 1 }}>
			<BigTitle
				icon={networkState.isConnected ? "folder-open" : "plane"}
				title={
					networkState.isConnected ? "Downloaded Episodes" : "Offline mode"
				}
			/>
			<MediaListCollection
				header={
					downloadedMediaEntries.length !== 0 ? null : (
						<BigTitle icon={"face-frown"} title="No downloaded episodes" />
					)
				}
				refreshing={loading ?? false}
				refresh={refetch}
				entries={downloadedMediaEntries}
			/>
		</ThemedView>
	);
}
