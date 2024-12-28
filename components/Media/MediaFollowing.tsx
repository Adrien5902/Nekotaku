import { gql } from "@/types/Anilist";
import type { Media } from "@/types/Anilist/graphql";
import { useQuery } from "@apollo/client";
import { RefreshControl, ScrollView } from "react-native";
import OtherUserMediaListEntry from "./OtherUserMediaListEntry";
import { ThemedText } from "../ThemedText";

export interface Props {
	media: Pick<Media, "id" | "episodes">;
}

export const FOLLOWING_MEDIA_LIST_QUERY = gql(`
    query FollowingMediaList($id: Int) {
        Page {
            mediaList(mediaId: $id, isFollowing: true, sort: UPDATED_TIME_DESC) {
            id
            status
            score
            progress
            user {
                    id
                    name
                    avatar {
                        large
                    }
                }
            }
        }
    }
`);

export default function MediaFollowing({ media }: Props) {
	const { error, loading, data, refetch } = useQuery(
		FOLLOWING_MEDIA_LIST_QUERY,
		{
			variables: {
				id: media.id,
			},
		},
	);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={loading} onRefresh={refetch} />
			}
		>
			{error ? (
				<ThemedText>Error: {error.message}</ThemedText>
			) : (
				data?.Page?.mediaList?.map((mediaList) => (
					<OtherUserMediaListEntry
						media={media}
						mediaList={mediaList}
						key={mediaList?.id}
					/>
				))
			)}
		</ScrollView>
	);
}
