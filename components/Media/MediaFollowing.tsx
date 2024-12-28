import { gql } from "@/types/Anilist";
import type { Media } from "@/types/Anilist/graphql";
import { useQuery } from "@apollo/client";
import { ScrollView } from "react-native";
import OtherUserMediaListEntry from "./OtherUserMediaListEntry";

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
	const { error, loading, data } = useQuery(FOLLOWING_MEDIA_LIST_QUERY, {
		variables: {
			id: media.id,
		},
	});

	return (
		<ScrollView>
			{data?.Page?.mediaList?.map((mediaList) => (
				<OtherUserMediaListEntry
					media={media}
					mediaList={mediaList}
					key={mediaList?.id}
				/>
			))}
		</ScrollView>
	);
}
