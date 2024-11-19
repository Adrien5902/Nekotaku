import EpisodesCollection from "@/components/Media/Episodes";
import MediaListStatusDisplay from "@/components/Media/Status";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AspectRatios, Spacing, TextSizes } from "@/constants/Sizes";
import {
	type MediaQuery,
	MediaType,
	ScoreFormat,
} from "@/types/Anilist/graphql";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import BannerTitleDisplay from "@/components/BannerTitleDisplay";
import {
	TabView,
	SceneMap,
	TabBar,
	type Route,
	type SceneRendererProps,
	type NavigationState,
	type TabDescriptor,
} from "react-native-tab-view";
import { useEffect, useState } from "react";
import { useThemeColors } from "@/hooks/useThemeColor";
import MediaDetails from "@/components/Media/MediaDetails";
import { Dimensions, View } from "react-native";
import Icon, { type IconName } from "@/components/Icon";
import EditMediaListStatus from "@/components/EditMediaListStatus";
import { gql } from "@/types/Anilist";
import MediaRelations from "@/components/Media/MediaRelations";
import DiskCache from "@/hooks/useDiskCache";

const QUERY = gql(`
	query Media($format: ScoreFormat, $mediaId: Int) {
		Media(id: $mediaId) {
			id
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

	const {
		loading: loadingApi,
		data: mediaData,
		error: apiError,
		refetch,
	} = useQuery(QUERY, {
		variables: {
			mediaId: Number.parseInt(id.toString()),
			format: ScoreFormat.Point_10Decimal,
		},
	});

	const {
		loading: loadingCache,
		error: cacheError,
		data: cacheData,
	} = DiskCache.use<MediaQuery["Media"] | undefined>("media", [id]);

	const media = mediaData?.Media ?? cacheData;

	if (cacheError && apiError) {
		return (
			<ThemedText>{`${cacheError.message}\n${apiError.message}`}</ThemedText>
		);
	}
	const loading = loadingApi ? loadingCache : false;

	useEffect(() => {
		if (mediaData?.Media?.id) {
			DiskCache.write("media", [mediaData.Media.id], mediaData.Media);
		}
	}, [mediaData]);

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
	const [index, setIndex] = useState(0);
	const colors = useThemeColors();

	const renderScene = SceneMap({
		episodes: () => <EpisodesCollection media={media} />,
		details: () => <MediaDetails media={media} />,
		relations: () => (
			<MediaRelations
				nodes={media?.relations?.edges?.map((edge, index) => ({
					media: media.relations?.nodes?.[index],
					mediaList: media.relations?.nodes?.[index]?.mediaListEntry,
					relationType: edge?.relationType,
				}))}
			/>
		),
		following: () => <ThemedText>following</ThemedText>,
		characters: () => <ThemedText>Characters</ThemedText>,
		staff: () => <ThemedText>staff</ThemedText>,
	});

	const [routes] = useState<Route[]>([
		...(media.type === MediaType.Anime
			? [{ key: "episodes", icon: "film" }]
			: []),
		{ key: "details", icon: "align-left" },
		{ key: "relations", icon: "link" },
		{ key: "following", icon: "user-plus" },
		{ key: "characters", icon: "user-group" },
		{ key: "staff", icon: "user-tie" },
	]);

	const renderTabBar: (
		props: SceneRendererProps & {
			navigationState: NavigationState<Route>;
			options: Record<string, TabDescriptor<Route>> | undefined;
		},
	) => React.ReactNode = (props) => (
		<TabBar
			{...props}
			indicatorStyle={{
				backgroundColor: colors.accent,
				height: Spacing.s,
				paddingHorizontal: Spacing.l,
				borderTopLeftRadius: Spacing.m,
				borderTopRightRadius: Spacing.m,
			}}
			style={{
				backgroundColor: "transparent",
				borderBottomWidth: Spacing.xs,
				borderColor: colors.primary,
			}}
			renderTabBarItem={({ route }) => {
				const routeIndex = routes.findIndex((r) => r.key === route.key);
				return (
					<View
						style={{
							paddingVertical: Spacing.m,
							width: Dimensions.get("window").width / routes.length,
							alignItems: "center",
						}}
						onTouchStart={() => setIndex(routeIndex)}
					>
						<Icon name={route.icon as IconName} size={TextSizes.l} />
					</View>
				);
			}}
			activeColor={colors.accent}
			inactiveColor={colors.text}
		/>
	);

	return (
		<TabView
			renderTabBar={renderTabBar}
			onIndexChange={setIndex}
			renderScene={renderScene}
			navigationState={{ index, routes }}
		/>
	);
}
