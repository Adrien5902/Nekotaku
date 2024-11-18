import { MediaListStatus, type MediaListGroup } from "@/types/Anilist/graphql";
import { type ApolloError, gql, useQuery } from "@apollo/client";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { useAnilistUserInfo } from "./AnilistUserInfoProvider";

const QUERY = gql`
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
							userPreferred
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
`;

const ToggleContext = createContext<{
	isManga: boolean;
	setIsManga: React.Dispatch<React.SetStateAction<boolean>> | null;
	listsData: {
		error: ApolloError | undefined;
		data: MediaListGroup[] | undefined;
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

	const { error, data, loading, refetch } = useQuery<{
		MediaListCollection: { lists: MediaListGroup[] };
	}>(QUERY, {
		variables: { userId: UserInfo?.id, type: isManga ? "MANGA" : "ANIME" },
	});

	const lists = data
		? [...data.MediaListCollection.lists].map((list) => {
				const entries = [...list.entries];
				entries.sort((a, b) =>
					(a.media?.title.english ?? a.media?.title.romaji ?? a.id) >
					(b.media?.title.english ?? a.media?.title.romaji ?? b.id)
						? 1
						: -1,
				);
				return { ...list, entries };
			})
		: undefined;

	lists?.sort((a, b) => {
		if (!a.status || !b.status) return 0;
		const diff =
			(Object.values(MediaListStatus).indexOf(a.status) ?? Number.MAX_VALUE) -
			(Object.values(MediaListStatus).indexOf(b.status) ?? Number.MAX_VALUE);

		if (diff === 0 && a.name && b.name) {
			return a.name > b.name ? 1 : -1;
		}
		return diff;
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
