import {
	Image,
	TouchableHighlight,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { type Href, router } from "expo-router";
import MediaListStatusDisplay, {
	type Props as StatusDisplayProps,
} from "./Status";
import Icon from "../Icon";
import { AspectRatios, Spacing, TextSizes } from "@/constants/Sizes";
import type {
	Media,
	MediaList,
	MediaRelation,
	MediaTitle,
} from "@/types/Anilist/graphql";
import useStyles from "@/hooks/useStyles";
import { useApolloClient } from "@apollo/client";
import { gql } from "@/types/Anilist";
import { useEffect, useState } from "react";
import { QUERY as MEDIA_LISTS_QUERY } from "../ToggleContext";
import { autoUpdateMediaListByProgress } from "@/types/MediaList";
import useLang from "@/hooks/useLang";

const ADD_ONE_PROGRESS_MUTATION = gql(`
mutation AddOneProgress($progress: Int, $status: MediaListStatus, $mediaId: Int) {
	SaveMediaListEntry(progress: $progress, status: $status, mediaId: $mediaId) {
		progress
		status
	}
}
`);

export interface Props {
	media?:
		| (StatusDisplayProps["media"] &
				Pick<Media, "coverImage" | "id" | "episodes"> & {
					title?: Pick<MediaTitle, "english" | "romaji"> | undefined | null;
				})
		| null
		| undefined;
	mediaList?:
		| (StatusDisplayProps["mediaList"] & Pick<MediaList, "score" | "repeat">)
		| null
		| undefined;
	relationType?: MediaRelation | null | undefined;
}

function EntryButton({
	media,
	mediaList: defaultMediaList,
	relationType,
}: Props) {
	const styles = useStyles();
	const api = useApolloClient();

	const [mediaList, setMediaList] = useState(defaultMediaList);
	useEffect(() => {
		setMediaList(defaultMediaList);
	}, [defaultMediaList]);

	const lang = useLang();

	return (
		<TouchableOpacity
			onPress={() => {
				router.push(`/media_details/${media?.id ?? 0}` as Href<string>);
			}}
			activeOpacity={0.7}
		>
			<ThemedView style={[styles.PrimaryElement, { flex: 1, padding: 0 }]}>
				<Image
					source={{ uri: media?.coverImage?.large ?? undefined }}
					style={{ width: 80, aspectRatio: AspectRatios.cover }}
					progressiveRenderingEnabled={true}
				/>
				<View
					style={{
						paddingHorizontal: Spacing.m,
						flex: 1,
						height: "100%",
						justifyContent: "space-around",
					}}
				>
					<View style={{ flexDirection: "row" }}>
						{relationType ? (
							<>
								<ThemedText color="accent" numberOfLines={1}>
									{lang.Anilist.MediaRelation[relationType]}
								</ThemedText>
								<ThemedText numberOfLines={1}> • </ThemedText>
							</>
						) : null}
						<ThemedText numberOfLines={1} style={{ flex: 1 }}>
							{media?.title?.english ?? media?.title?.romaji}
						</ThemedText>
					</View>

					<MediaListStatusDisplay mediaList={mediaList} media={media} />

					<ThemedView
						color="primary"
						style={{
							height: Spacing.s,
							justifyContent: "center",
							width: "100%",
							borderRadius: Spacing.s,
							overflow: "hidden",
						}}
					>
						{mediaList?.progress && media?.episodes ? (
							<ThemedView
								color="accent"
								style={{
									height: 5,
									width: `${(mediaList.progress / media?.episodes) * 100}%`,
								}}
							/>
						) : null}
					</ThemedView>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<View>
							{mediaList?.score ? (
								<ThemedText>
									{mediaList?.score}
									<Icon size={TextSizes.m} name="star-half-stroke" />
								</ThemedText>
							) : null}
						</View>
						{mediaList?.repeat ? (
							<ThemedText>
								{mediaList?.repeat}
								<Icon size={TextSizes.m} name="repeat" />
							</ThemedText>
						) : null}
						{media?.episodes && typeof mediaList?.progress === "number" ? (
							<TouchableHighlight
								onPress={async () => {
									if (
										media.episodes &&
										(mediaList.progress ?? 0) < media.episodes
									) {
										Vibration.vibrate([70, 40]);
										try {
											const newMediaList = autoUpdateMediaListByProgress(
												media,
												{
													...mediaList,
													progress: (mediaList.progress ?? 0) + 1,
												},
											);

											const res = await api.mutate({
												mutation: ADD_ONE_PROGRESS_MUTATION,
												variables: {
													mediaId: media.id,
													...newMediaList,
												},
												refetchQueries: [MEDIA_LISTS_QUERY],
											});

											setMediaList((curr) => ({
												...curr,
												...res.data?.SaveMediaListEntry,
											}));
										} catch (error) {
											console.error(error);
											// TODO: handle error
										}
									}
								}}
								style={{
									borderRadius: Spacing.s,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										padding: Spacing.xs,
									}}
								>
									<ThemedText>
										{mediaList.progress}/{media.episodes}
									</ThemedText>
									{mediaList.progress < media.episodes ? (
										<ThemedText>
											{" "}
											<Icon size={TextSizes.m} name="plus" />
										</ThemedText>
									) : null}
								</View>
							</TouchableHighlight>
						) : null}
					</View>
				</View>
			</ThemedView>
		</TouchableOpacity>
	);
}

export default EntryButton;
