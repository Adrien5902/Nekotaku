import EpisodesCollection from "@/components/Media/Episodes";
import MediaListStatusDisplay from "@/components/Media/Status";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AspectRatios, Spacing, TextSizes } from "@/constants/Sizes";
import type { Media, MediaList } from "@/types/Anilist";
import { gql, useQuery } from "@apollo/client";
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
import { useState } from "react";
import { useThemeColors } from "@/hooks/useThemeColor";
import MediaDetails from "@/components/Media/MediaDetails";
import { Dimensions, View } from "react-native";
import Icon, { type IconName } from "@/components/Icon";

const QUERY = gql`query MediaList($mediaListId: Int) {
	MediaList(id: $mediaListId) {
		status
		score
		progress
		progressVolumes
		repeat
		priority
		private
		notes
		hiddenFromStatusLists
		customLists
		advancedScores
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
		media {
			id
			format
			status
			description
			popularity
			favourites
			meanScore
			averageScore
			coverImage{
				large
				color
			}
			bannerImage
			title {
				romaji
				english
				userPreferred
			}
			isFavourite
			synonyms
		}
	}
}`;

export default function MediaPage() {
	const colors = useThemeColors();
	const [index, setIndex] = useState(0);
	const { id } = useLocalSearchParams();
	const {
		loading,
		data: mediaListData,
		error,
	} = useQuery<{ MediaList: MediaList }>(QUERY, {
		variables: { mediaListId: id },
	});

	const mediaList = mediaListData?.MediaList;

	const [routes] = useState<Route[]>([
		{ key: "episodes", icon: "film" },
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
			renderTabBarItem={({ route }) => (
				<View
					style={{
						paddingVertical: Spacing.m,
						width: Dimensions.get("window").width / routes.length,
						alignItems: "center",
					}}
				>
					<Icon name={route.icon as IconName} size={TextSizes.l} />
				</View>
			)}
			activeColor={colors.accent}
			inactiveColor={colors.text}
		/>
	);

	const renderScene = SceneMap({
		episodes: () => <EpisodesCollection mediaList={mediaList as MediaList} />,
		details: () => <MediaDetails media={mediaList?.media as Media} />,
		following: () => <ThemedText>following</ThemedText>,
		relations: () => <ThemedText>Relations</ThemedText>,
		characters: () => <ThemedText>Characters</ThemedText>,
		staff: () => <ThemedText>staff</ThemedText>,
	});

	if (error) {
		return <ThemedText>{error.message}</ThemedText>;
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
			{!loading ? (
				<>
					<BannerTitleDisplay
						avatarAspectRatio={AspectRatios.cover}
						avatarSource={{
							uri: mediaList?.media?.coverImage?.large ?? undefined,
						}}
						bannerSource={{ uri: mediaList?.media?.bannerImage ?? undefined }}
						text={
							<>
								<ThemedText numberOfLines={2} size="m">
									{mediaList?.media?.title?.english}
								</ThemedText>
								<ThemedText numberOfLines={1} size="s" style={{ opacity: 0.6 }}>
									{mediaList?.media?.title?.romaji}
								</ThemedText>
								<MediaListStatusDisplay {...{ mediaList }} size="s" />
							</>
						}
					/>
					<TabView
						renderTabBar={renderTabBar}
						onIndexChange={setIndex}
						renderScene={renderScene}
						navigationState={{ index, routes }}
					/>
				</>
			) : null}
		</ThemedView>
	);
}
