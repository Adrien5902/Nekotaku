import {
	type MediaListCollectionQuery,
	MediaListStatus,
	MediaType,
} from "@/types/Anilist/graphql";
import { type ApolloError, useQuery } from "@apollo/client";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { useAnilistUserInfo } from "./AnilistUserInfoProvider";
import { gql } from "@/types/Anilist";

const QUERY = gql(`
	query MediaListCollection($userId: Int, $type: MediaType, $version: Int) {
		MediaListCollection(userId: $userId, type: $type) {
			lists {
				entries {
					id
					status
					media {
						id
						title {
							english
							romaji
						}
						coverImage {
							large
						}
						status(version: $version)
						nextAiringEpisode {
							airingAt
							timeUntilAiring
							episode
						}
						format
						episodes
					}
					progress
					repeat
					score
				}
				name
				status
			}
		}
	}
`);

export type MediaCollectionData = NonNullable<
	NonNullable<
		NonNullable<MediaListCollectionQuery["MediaListCollection"]>["lists"]
	>
>;

const ToggleContext = createContext<{
	isManga: boolean;
	setIsManga: React.Dispatch<React.SetStateAction<boolean>> | null;
	listsData: {
		error?: ApolloError;
		data?: MediaCollectionData;
		loading: boolean;
		refetch: () => void;
	};
}>({
	isManga: false,
	setIsManga: null,
	listsData: { error: undefined, data: undefined, loading: true, refetch() {} },
});

export const ToggleProvider = ({ children }: { children: React.ReactNode }) => {
	const [isManga, setIsManga] = useState(false);
	const UserInfo = useAnilistUserInfo();

	const { error, data, loading, refetch } = useQuery(QUERY, {
		variables: {
			userId: UserInfo?.id,
			type: isManga ? MediaType.Manga : MediaType.Anime,
		},
	});

	const lists = data?.MediaListCollection?.lists
		? [...data.MediaListCollection.lists].map((list) => {
				const entries = [...(list?.entries ?? [])];
				entries.sort((a, b) =>
					(a?.media?.title?.english ?? a?.media?.title?.romaji ?? a?.id ?? 0) >
					(b?.media?.title?.english ?? a?.media?.title?.romaji ?? b?.id ?? 0)
						? 1
						: -1,
				);
				return { ...list, entries };
			})
		: undefined;

	lists?.sort((a, b) => {
		if (a.name && b.name) {
			return (
				(UserInfo?.mediaListOptions?.animeList?.sectionOrder?.indexOf(a.name) ??
					0) -
				(UserInfo?.mediaListOptions?.animeList?.sectionOrder?.indexOf(b.name) ??
					0)
			);
		}
		return 0;
	});

	return (
		<ToggleContext.Provider
			value={{
				isManga,
				setIsManga,
				listsData: { error, data: lists, loading, refetch },
			}}
		>
			{children}
		</ToggleContext.Provider>
	);
};

export const useToggle = () => useContext(ToggleContext);
