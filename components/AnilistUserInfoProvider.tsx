import { createContext, useContext } from "react";
import { type ApolloError, useQuery } from "@apollo/client";
import { gql } from "@/types/Anilist";
import type { ViewerQuery } from "@/types/Anilist/graphql";

const AnilistUserInfoContext = createContext<
	| { data: ViewerQuery["Viewer"]; loading: boolean; error?: ApolloError }
	| undefined
>(undefined);

interface Props {
	children: React.ReactNode;
}

const QUERY = gql(`
	query Viewer {
		Viewer {
			id
			name
			about
			avatar {
				medium
			}
			bannerImage
			mediaListOptions {
				animeList {
					sectionOrder
				}
			}
		}
	}
`);

export default function AnilistUserInfoProvider({ children }: Props) {
	const { error, data: v, loading } = useQuery(QUERY);
	const data = v?.Viewer;

	return (
		<AnilistUserInfoContext.Provider value={{ error, loading, data }}>
			{children}
		</AnilistUserInfoContext.Provider>
	);
}

export const useAnilistUserInfo = () => useContext(AnilistUserInfoContext);
