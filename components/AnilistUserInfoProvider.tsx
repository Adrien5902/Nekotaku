import { createContext, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { ThemedText } from "./ThemedText";
import type { User } from "@/types/Anilist/graphql";
import { RefreshControl } from "react-native";

const AnilistUserInfoContext = createContext<User | null>(null);

interface Props {
	children: React.ReactNode;
}

const QUERY = gql`
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
}`;

export default function AnilistUserInfoProvider({ children }: Props) {
	const { error, data, loading, refetch } = useQuery(QUERY);
	const Viewer = data?.Viewer as User;

	return (
		<AnilistUserInfoContext.Provider value={Viewer}>
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
