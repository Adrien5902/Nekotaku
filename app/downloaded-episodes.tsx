import { DownloadingContext } from "@/components/DownloadingContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/Sizes";
import { useContext } from "react";
import { useToggle } from "../components/ToggleContext";
import EntryButton from "@/components/Media/EntryButton";
import { RefreshControl, ScrollView } from "react-native";
import Icon from "@/components/Icon";
import BigTitle from "@/components/BigTitle";

export default function DownloadedEpisodes() {
	const downloader = useContext(DownloadingContext);
	const { listsData } = useToggle();
	const { data, error, loading } = listsData;

	if (error) {
		return (
			<ThemedView
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ThemedText>{error.message}</ThemedText>
			</ThemedView>
		);
	}

	const entries = data?.flatMap((m) => m.entries);
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

					const entry = entries?.find(
						(mediaList) => mediaList?.media?.id === mediaId,
					);
					if (!entry) {
						return (
							<ThemedText>
								Error could not get media with id : {mediaId}
							</ThemedText>
						);
					}

					return <EntryButton key={mediaId} entry={entry} />;
				})
			) : (
				<ThemedText>No downloaded Episodes {":("}</ThemedText>
			)}
		</ScrollView>
	);
}
