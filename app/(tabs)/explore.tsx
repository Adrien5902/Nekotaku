import { RefreshControl, VirtualizedList } from "react-native";
import { useToggle } from "../../components/ToggleContext";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import EntryButton from "@/components/Media/EntryButton";
import type { SearchQuery } from "@/types/Anilist/graphql";
import { gql } from "@/types/Anilist";
import { useQuery } from "@apollo/client";

export const QUERY = gql(`
query Search(
	$search: String
	$page: Int
	$perPage: Int
	$type: MediaType
) {
	trending: Page(page: $page, perPage: $perPage) {
		media(sort: [TRENDING_DESC], type: $type) {
		...EntryButton
		}
	}
	search: Page(page: $page, perPage: $perPage) {
		media(search: $search, sort: [SEARCH_MATCH], type: $type) {
		...EntryButton
		}
	}

}

fragment EntryButton on Media {
	id
	title {
		english
		romaji
	}
	coverImage {
		large
	}
	status
	format
	episodes
	nextAiringEpisode {
		episode
		timeUntilAiring
	}
	mediaListEntry{
		status 
		progress
		repeat 
		score
	}
}
`);

type Q = NonNullable<SearchQuery["search"] & SearchQuery["trending"]>;

type Bucket = NonNullable<Q["media"]>;

export default function ExploreScreen() {
	const { appMode } = useToggle();
	const colors = useThemeColors();

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [bucket, setBucket] = useState<Bucket>([]);

	const { data, loading } = useQuery(QUERY, {
		variables: { page, search, perPage: 30, type: appMode },
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!loading) {
			setBucket((b) =>
				[
					...b,
					...((search ? data?.search?.media : data?.trending?.media) ?? []),
				].filter((a) => !!a),
			);
		}
	}, [loading]);

	const hasNextPage = !!(search ? data?.search?.media : data?.trending?.media)
		?.length;

	return (
		<ThemedView
			style={{
				flex: 1,
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "stretch",
				paddingTop: Spacing.xl,
			}}
		>
			<VirtualizedList
				refreshControl={<RefreshControl refreshing={loading} />}
				refreshing={loading}
				renderItem={({ item }) => (
					<EntryButton
						media={item as (typeof bucket)[number]}
						mediaList={(item as (typeof bucket)[number])?.mediaListEntry}
					/>
				)}
				getItem={(_data, index) => bucket[index]}
				getItemCount={() => bucket.length}
				keyExtractor={(item) =>
					((item as (typeof bucket)[number])?.id ?? "").toString()
				}
				onEndReached={() => {
					if (!loading && hasNextPage) {
						setPage((p) => p + 1);
					}
				}}
				initialNumToRender={10}
			/>

			<ThemedView
				color="primary"
				style={{
					borderTopLeftRadius: Spacing.m,
					borderTopRightRadius: Spacing.m,
					borderBottomWidth: Spacing.xs,
					borderColor: colors.background,
					padding: Spacing.m,
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<SearchBar
					onEndEditing={(value) => {
						setPage(1);
						setSearch(value);
						setBucket([]);
					}}
				/>
			</ThemedView>
		</ThemedView>
	);
}
