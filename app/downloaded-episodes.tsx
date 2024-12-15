import { DownloadingContext } from "@/components/DownloadingContext";
import { ThemedView } from "@/components/ThemedView";
import { useContext } from "react";
import { useToggle } from "../components/ToggleContext";
import BigTitle from "@/components/BigTitle";
import MediaListCollection from "@/components/Media/MediaCollection";
import { Spacing } from "@/constants/Sizes";
import { useNetworkState } from "expo-network";
import Cache, { CacheReadType } from "@/hooks/useCache";
import { useSettings } from "@/components/Settings/Context";
import NavButton from "@/components/NavButton";
import useLang from "@/hooks/useLang";
import { ThemedText } from "@/components/ThemedText";

export default function DownloadedEpisodes() {
	const downloader = useContext(DownloadingContext);
	const settings = useSettings();
	const { listsData } = useToggle();
	const { loading: cacheLoading, data: cacheData } = Cache.useAll(
		CacheReadType.MemoryAndIfNotDisk,
		"media",
	);
	const { data: lists, loading: listsLoading, refetch, error } = listsData;

	const networkState = useNetworkState();

	const loading =
		cacheLoading || (networkState.isConnected ? listsLoading : false);

	const cachedMedias = cacheData ? Object.values(cacheData) : [];
	const entries = lists?.flatMap((m) => m?.entries ?? []);
	const downloadedMediaEntries = Object.keys(downloader.downloadedEpisodes).map(
		(mediaIdString) => {
			const mediaId = Number.parseInt(mediaIdString);

			const entry = entries?.find(
				(mediaList) => mediaList?.media?.id === mediaId,
			);
			if (entry) return entry;

			const cachedMedia = cachedMedias.find((media) => media?.id === mediaId);
			return {
				...cachedMedia?.mediaListEntry,
				media: cachedMedia,
			};
		},
	);

	const lang = useLang();

	if (!settings.offlineMode && error) {
		return <ThemedText>{error.message}</ThemedText>;
	}

	return (
		<ThemedView style={{ paddingTop: Spacing.xl, flex: 1 }}>
			{settings.offlineMode ? (
				<NavButton
					style={{ position: "absolute", right: Spacing.l, top: Spacing.m }}
					icon="gears"
					route="/settings"
				/>
			) : null}
			<BigTitle
				icon={networkState.isConnected ? "folder-open" : "plane"}
				title={
					networkState.isConnected
						? lang.pages.downloadedEpisodes.title
						: "Offline mode"
				}
			/>
			<MediaListCollection
				header={
					downloadedMediaEntries.length !== 0 ? null : (
						<BigTitle
							icon={"face-frown"}
							title={lang.pages.downloadedEpisodes.noDownloadedEpisodes}
						/>
					)
				}
				refreshing={loading ?? false}
				refresh={refetch}
				entries={downloadedMediaEntries}
			/>
		</ThemedView>
	);
}
