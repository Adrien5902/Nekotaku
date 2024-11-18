import { createContext, useContext } from "react";
import { QueryResult, useQuery } from "@apollo/client";
import { ThemedText } from "./ThemedText";
import { RefreshControl } from "react-native";
import { gql } from "@/types/Anilist";
import type { ViewerQuery } from "@/types/Anilist/graphql";

const AnilistUserInfoContext = createContext<ViewerQuery["Viewer"] | null>(
	null,
);

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
		}
	}
`);

export default function AnilistUserInfoProvider({ children }: Props) {
	const { error, data, loading } = useQuery(QUERY);
	const Viewer = data?.Viewer;

	return (
		<AnilistUserInfoContext.Provider value={Viewer ?? null}>
			{loading ? (
				<RefreshControl refreshing={true} />
			) : error ? (
				<ThemedText>{error.message}</ThemedText>
			) : (
				children
			)}
		</AnilistUserInfoContext.Provider>
	);
}

export const useAnilistUserInfo = () => useContext(AnilistUserInfoContext);
