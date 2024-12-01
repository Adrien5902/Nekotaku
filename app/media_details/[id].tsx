import EpisodesCollection from "@/components/Media/Episodes";
import MediaListStatusDisplay from "@/components/Media/Status";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AspectRatios, Spacing } from "@/constants/Sizes";
import {
	type MediaQuery,
	MediaType,
	ScoreFormat,
} from "@/types/Anilist/graphql";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import BannerTitleDisplay from "@/components/BannerTitleDisplay";
import { useEffect } from "react";
import MediaDetails from "@/components/Media/MediaDetails";
import EditMediaListStatus from "@/components/EditMediaListStatus";
import { gql } from "@/types/Anilist";
import MediaRelations from "@/components/Media/MediaRelations";
import Cache, { CacheReadType } from "@/hooks/useCache";
import CustomTabView from "@/components/CustomTabView";

export const QUERY = gql(`
	query Media($format: ScoreFormat, $mediaId: Int) {
		Media(id: $mediaId) {
			id
			idMal
			type
			format
			status
			description
			popularity
			favourites
			meanScore
			averageScore
			episodes
			isFavourite
			synonyms
			trailer {
				id
				site
				thumbnail
			}
			coverImage {
				large
				color
			}
			bannerImage
			title {
				romaji
				english
			}
			relations {
				edges {
					relationType
				}
				nodes {
					id
					episodes
					coverImage {
						large
					}
					title {
						english
						romaji
					}
					status
					format
			
					mediaListEntry {
						id
						progress
						score
						repeat
						startedAt {
							year
							month
							day
						}
						completedAt {
							year
							month
							day
						}
					}
				}
			}
		
			mediaListEntry {
				id
				status
				score(format: $format)
				progress
				progressVolumes
				repeat
				private
				notes
				hiddenFromStatusLists
				customLists
				startedAt {
					year
					month
					day
				}
				completedAt {
					year
					month
					day
				}
				updatedAt
				createdAt
			}
		}
		}
`);

export default function MediaPage() {
	const { id } = useLocalSearchParams();
	const mediaId = Number.parseInt(id.toString());

	const {
		loading: loadingApi,
		data: mediaData,
		error: apiError,
		refetch,
	} = useQuery(QUERY, {
		variables: {
			mediaId,
			format: ScoreFormat.Point_10Decimal,
		},
	});

	const { loading: loadingCache, data: cacheData } = Cache.use(
		CacheReadType.Disk,
		"media",
		[mediaId],
	);

	const media = mediaData?.Media ?? cacheData;
	const loading = loadingApi ? loadingCache : false;

	useEffect(() => {
		if (mediaData?.Media?.id) {
			Cache.write(
				CacheReadType.Disk,
				"media",
				[mediaData.Media.id],
				mediaData.Media,
			);
		}
	}, [mediaData]);

	if (apiError) {
		return <ThemedText>{apiError.message}</ThemedText>;
	}

	return (
		<ThemedView
			style={{
				paddingTop: Spacing.xl,
				flexDirection: "column",
				height: "100%",
				flex: 1,
			}}
		>
			{!loading && media ? (
				<>
					<BannerTitleDisplay
						avatarAspectRatio={AspectRatios.cover}
						avatarSource={
							media.coverImage?.large
								? { uri: media.coverImage.large }
								: undefined
						}
						bannerSource={
							media.bannerImage ? { uri: media.bannerImage } : undefined
						}
						text={
							<>
								<ThemedText numberOfLines={2} size="m">
									{media.title?.english}
								</ThemedText>
								<ThemedText numberOfLines={1} size="s" style={{ opacity: 0.6 }}>
									{media.title?.romaji}
								</ThemedText>
								<MediaListStatusDisplay
									mediaList={media.mediaListEntry}
									media={media}
									size="s"
								/>
							</>
						}
					/>
					<MediaPageTabBar media={media} />
					<EditMediaListStatus
						currentStatus={media.mediaListEntry}
						media={media}
						refetch={refetch}
					/>
				</>
			) : null}
		</ThemedView>
	);
}

function MediaPageTabBar({
	media,
}: {
	media: NonNullable<MediaQuery["Media"]>;
}) {
	const scenes = [
		...(media.type === MediaType.Anime
			? [
					{
						key: "episodes",
						icon: "film",

						component: () => (
							<EpisodesCollection
								media={media}
								progress={media.mediaListEntry?.progress}
							/>
						),
					},
				]
			: []),

		{
			component: () => <MediaDetails media={media} />,
			key: "details",
			icon: "align-left",
		},
		{
			key: "relations",
			icon: "link",
			component: () => (
				<MediaRelations
					nodes={media?.relations?.edges?.map((edge, index) => ({
						media: media.relations?.nodes?.[index],
						mediaList: media.relations?.nodes?.[index]?.mediaListEntry,
						relationType: edge?.relationType,
					}))}
				/>
			),
		},
		{
			key: "following",
			icon: "user-plus",
			component: () => <ThemedText>following</ThemedText>,
		},
		{
			key: "characters",
			icon: "user-group",
			component: () => <ThemedText>Characters</ThemedText>,
		},
		{
			component: () => <ThemedText>staff</ThemedText>,
			key: "staff",
			icon: "user-tie",
		},
	];

	return <CustomTabView scenes={scenes} />;
}
