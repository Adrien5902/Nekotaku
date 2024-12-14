import { gql } from "./Anilist";
import { type FuzzyDate, MediaListStatus, type Media, type MediaList } from "./Anilist/graphql";

export function autoUpdateMediaListByProgress(media: Pick<Media, "episodes">, mediaList: Pick<MediaList, "progress" | "startedAt" | "completedAt" | "status">): Partial<MediaList> {
	const hasWatchedAllEpisodes = mediaList?.progress === media?.episodes;

	const status = hasWatchedAllEpisodes ? MediaListStatus.Completed : mediaList?.progress !== 0 ? MediaListStatus.Current : mediaList.status
	const startedAt = !mediaList?.startedAt?.year ? currentFuzzyDate() : mediaList.startedAt;
	const completedAt = status === MediaListStatus.Completed && !mediaList?.completedAt?.year ? currentFuzzyDate() : mediaList?.completedAt

	return {
		...mediaList,
		status,
		completedAt,
		startedAt,
	}
}

export function autoUpdateMediaListByStatus(mediaList: MediaList): MediaList {
	// TODO : see https://github.com/Adrien5902/Nekotaku/issues/29
	return {
		...mediaList
	}
}

export function currentFuzzyDate(): FuzzyDate {
	const date = new Date(Date.now())
	return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
}


export const GET_MEDIA_QUERY = gql(`
	query Media($format: ScoreFormat, $mediaId: Int) {
		Media(id: $mediaId) {
			id
			idMal
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
			duration
			season
			source
			countryOfOrigin
			seasonYear
			startDate {
				day
				month
				year
			}
			endDate {
				day
				month
				year
			}
			trailer {
				id
				site
				thumbnail
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
			nextAiringEpisode {
				episode
				timeUntilAiring
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
