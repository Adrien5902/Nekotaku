/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n\tquery Media($format: ScoreFormat, $mediaId: Int) {\n\t\tMedia(id: $mediaId) {\n\t\t\tid\n\t\t\tidMal\n\t\t\ttype\n\t\t\tformat\n\t\t\tstatus\n\t\t\tdescription\n\t\t\tpopularity\n\t\t\tfavourites\n\t\t\tmeanScore\n\t\t\taverageScore\n\t\t\tepisodes\n\t\t\tisFavourite\n\t\t\tsynonyms\n\t\t\ttrailer {\n\t\t\t\tid\n\t\t\t\tsite\n\t\t\t}\n\t\t\tcoverImage {\n\t\t\t\tlarge\n\t\t\t\tcolor\n\t\t\t}\n\t\t\tbannerImage\n\t\t\ttitle {\n\t\t\t\tromaji\n\t\t\t\tenglish\n\t\t\t}\n\t\t\trelations {\n\t\t\t\tedges {\n\t\t\t\t\trelationType\n\t\t\t\t}\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tepisodes\n\t\t\t\t\tcoverImage {\n\t\t\t\t\t\tlarge\n\t\t\t\t\t}\n\t\t\t\t\ttitle {\n\t\t\t\t\t\tenglish\n\t\t\t\t\t\tromaji\n\t\t\t\t\t}\n\t\t\t\t\tstatus\n\t\t\t\t\tformat\n\t\t\t\n\t\t\t\t\tmediaListEntry {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tprogress\n\t\t\t\t\t\tscore\n\t\t\t\t\t\trepeat\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\n\t\t\tmediaListEntry {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t\tscore(format: $format)\n\t\t\t\tprogress\n\t\t\t\tprogressVolumes\n\t\t\t\trepeat\n\t\t\t\tprivate\n\t\t\t\tnotes\n\t\t\t\thiddenFromStatusLists\n\t\t\t\tcustomLists\n\t\t\t\tstartedAt {\n\t\t\t\t\tyear\n\t\t\t\t\tmonth\n\t\t\t\t\tday\n\t\t\t\t}\n\t\t\t\tcompletedAt {\n\t\t\t\t\tyear\n\t\t\t\t\tmonth\n\t\t\t\t\tday\n\t\t\t\t}\n\t\t\t\tupdatedAt\n\t\t\t\tcreatedAt\n\t\t\t}\n\t\t}\n\t\t}\n": types.MediaDocument,
    "\n\tquery Viewer {\n\t\tViewer {\n\t\t\tid\n\t\t\tname\n\t\t\tabout\n\t\t\tavatar {\n\t\t\t\tmedium\n\t\t\t}\n\t\t\tbannerImage\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tsectionOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.ViewerDocument,
    "\n\tmutation Mutation(\n\t$mediaId: Int\n\t$score: Float\n\t$status: MediaListStatus\n\t$progress: Int\n\t$repeat: Int\n\t$private: Boolean\n\t$notes: String\n\t$hiddenFromStatusLists: Boolean\n\t$startedAt: FuzzyDateInput\n\t$completedAt: FuzzyDateInput\n\t$customLists: [String]\n\t) {\n\t\tSaveMediaListEntry(\n\t\t\tmediaId: $mediaId\n\t\t\tscore: $score\n\t\t\tstatus: $status\n\t\t\tprogress: $progress\n\t\t\trepeat: $repeat\n\t\t\tprivate: $private\n\t\t\tnotes: $notes\n\t\t\thiddenFromStatusLists: $hiddenFromStatusLists\n\t\t\tstartedAt: $startedAt\n\t\t\tcompletedAt: $completedAt\n\t\t\tcustomLists: $customLists\n\t\t) {\n\t\t\tid\n\t\t}\n\t}\n": types.MutationDocument,
    "\nmutation AddOneProgress($progress: Int, $status: MediaListStatus, $mediaId: Int) {\n\tSaveMediaListEntry(progress: $progress, status: $status, mediaId: $mediaId) {\n\t\tprogress\n\t\tstatus\n\t}\n}\n": types.AddOneProgressDocument,
    "\n\tquery MediaListCollection($userId: Int, $type: MediaType, $version: Int) {\n\t\tMediaListCollection(userId: $userId, type: $type) {\n\t\t\tlists {\n\t\t\t\tentries {\n\t\t\t\t\tid\n\t\t\t\t\tstatus\n\t\t\t\t\tmedia {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle {\n\t\t\t\t\t\t\tenglish\n\t\t\t\t\t\t\tromaji\n\t\t\t\t\t\t}\n\t\t\t\t\t\tcoverImage {\n\t\t\t\t\t\t\tlarge\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstatus(version: $version)\n\t\t\t\t\t\tnextAiringEpisode {\n\t\t\t\t\t\t\tairingAt\n\t\t\t\t\t\t\ttimeUntilAiring\n\t\t\t\t\t\t\tepisode\n\t\t\t\t\t\t}\n\t\t\t\t\t\tformat\n\t\t\t\t\t\tepisodes\n\t\t\t\t\t}\n\t\t\t\t\tprogress\n\t\t\t\t\trepeat\n\t\t\t\t\tscore\n\t\t\t\t}\n\t\t\t\tname\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n": types.MediaListCollectionDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery Media($format: ScoreFormat, $mediaId: Int) {\n\t\tMedia(id: $mediaId) {\n\t\t\tid\n\t\t\tidMal\n\t\t\ttype\n\t\t\tformat\n\t\t\tstatus\n\t\t\tdescription\n\t\t\tpopularity\n\t\t\tfavourites\n\t\t\tmeanScore\n\t\t\taverageScore\n\t\t\tepisodes\n\t\t\tisFavourite\n\t\t\tsynonyms\n\t\t\ttrailer {\n\t\t\t\tid\n\t\t\t\tsite\n\t\t\t}\n\t\t\tcoverImage {\n\t\t\t\tlarge\n\t\t\t\tcolor\n\t\t\t}\n\t\t\tbannerImage\n\t\t\ttitle {\n\t\t\t\tromaji\n\t\t\t\tenglish\n\t\t\t}\n\t\t\trelations {\n\t\t\t\tedges {\n\t\t\t\t\trelationType\n\t\t\t\t}\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tepisodes\n\t\t\t\t\tcoverImage {\n\t\t\t\t\t\tlarge\n\t\t\t\t\t}\n\t\t\t\t\ttitle {\n\t\t\t\t\t\tenglish\n\t\t\t\t\t\tromaji\n\t\t\t\t\t}\n\t\t\t\t\tstatus\n\t\t\t\t\tformat\n\t\t\t\n\t\t\t\t\tmediaListEntry {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tprogress\n\t\t\t\t\t\tscore\n\t\t\t\t\t\trepeat\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\n\t\t\tmediaListEntry {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t\tscore(format: $format)\n\t\t\t\tprogress\n\t\t\t\tprogressVolumes\n\t\t\t\trepeat\n\t\t\t\tprivate\n\t\t\t\tnotes\n\t\t\t\thiddenFromStatusLists\n\t\t\t\tcustomLists\n\t\t\t\tstartedAt {\n\t\t\t\t\tyear\n\t\t\t\t\tmonth\n\t\t\t\t\tday\n\t\t\t\t}\n\t\t\t\tcompletedAt {\n\t\t\t\t\tyear\n\t\t\t\t\tmonth\n\t\t\t\t\tday\n\t\t\t\t}\n\t\t\t\tupdatedAt\n\t\t\t\tcreatedAt\n\t\t\t}\n\t\t}\n\t\t}\n"): (typeof documents)["\n\tquery Media($format: ScoreFormat, $mediaId: Int) {\n\t\tMedia(id: $mediaId) {\n\t\t\tid\n\t\t\tidMal\n\t\t\ttype\n\t\t\tformat\n\t\t\tstatus\n\t\t\tdescription\n\t\t\tpopularity\n\t\t\tfavourites\n\t\t\tmeanScore\n\t\t\taverageScore\n\t\t\tepisodes\n\t\t\tisFavourite\n\t\t\tsynonyms\n\t\t\ttrailer {\n\t\t\t\tid\n\t\t\t\tsite\n\t\t\t}\n\t\t\tcoverImage {\n\t\t\t\tlarge\n\t\t\t\tcolor\n\t\t\t}\n\t\t\tbannerImage\n\t\t\ttitle {\n\t\t\t\tromaji\n\t\t\t\tenglish\n\t\t\t}\n\t\t\trelations {\n\t\t\t\tedges {\n\t\t\t\t\trelationType\n\t\t\t\t}\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tepisodes\n\t\t\t\t\tcoverImage {\n\t\t\t\t\t\tlarge\n\t\t\t\t\t}\n\t\t\t\t\ttitle {\n\t\t\t\t\t\tenglish\n\t\t\t\t\t\tromaji\n\t\t\t\t\t}\n\t\t\t\t\tstatus\n\t\t\t\t\tformat\n\t\t\t\n\t\t\t\t\tmediaListEntry {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tprogress\n\t\t\t\t\t\tscore\n\t\t\t\t\t\trepeat\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\n\t\t\tmediaListEntry {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t\tscore(format: $format)\n\t\t\t\tprogress\n\t\t\t\tprogressVolumes\n\t\t\t\trepeat\n\t\t\t\tprivate\n\t\t\t\tnotes\n\t\t\t\thiddenFromStatusLists\n\t\t\t\tcustomLists\n\t\t\t\tstartedAt {\n\t\t\t\t\tyear\n\t\t\t\t\tmonth\n\t\t\t\t\tday\n\t\t\t\t}\n\t\t\t\tcompletedAt {\n\t\t\t\t\tyear\n\t\t\t\t\tmonth\n\t\t\t\t\tday\n\t\t\t\t}\n\t\t\t\tupdatedAt\n\t\t\t\tcreatedAt\n\t\t\t}\n\t\t}\n\t\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery Viewer {\n\t\tViewer {\n\t\t\tid\n\t\t\tname\n\t\t\tabout\n\t\t\tavatar {\n\t\t\t\tmedium\n\t\t\t}\n\t\t\tbannerImage\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tsectionOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery Viewer {\n\t\tViewer {\n\t\t\tid\n\t\t\tname\n\t\t\tabout\n\t\t\tavatar {\n\t\t\t\tmedium\n\t\t\t}\n\t\t\tbannerImage\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tsectionOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation Mutation(\n\t$mediaId: Int\n\t$score: Float\n\t$status: MediaListStatus\n\t$progress: Int\n\t$repeat: Int\n\t$private: Boolean\n\t$notes: String\n\t$hiddenFromStatusLists: Boolean\n\t$startedAt: FuzzyDateInput\n\t$completedAt: FuzzyDateInput\n\t$customLists: [String]\n\t) {\n\t\tSaveMediaListEntry(\n\t\t\tmediaId: $mediaId\n\t\t\tscore: $score\n\t\t\tstatus: $status\n\t\t\tprogress: $progress\n\t\t\trepeat: $repeat\n\t\t\tprivate: $private\n\t\t\tnotes: $notes\n\t\t\thiddenFromStatusLists: $hiddenFromStatusLists\n\t\t\tstartedAt: $startedAt\n\t\t\tcompletedAt: $completedAt\n\t\t\tcustomLists: $customLists\n\t\t) {\n\t\t\tid\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation Mutation(\n\t$mediaId: Int\n\t$score: Float\n\t$status: MediaListStatus\n\t$progress: Int\n\t$repeat: Int\n\t$private: Boolean\n\t$notes: String\n\t$hiddenFromStatusLists: Boolean\n\t$startedAt: FuzzyDateInput\n\t$completedAt: FuzzyDateInput\n\t$customLists: [String]\n\t) {\n\t\tSaveMediaListEntry(\n\t\t\tmediaId: $mediaId\n\t\t\tscore: $score\n\t\t\tstatus: $status\n\t\t\tprogress: $progress\n\t\t\trepeat: $repeat\n\t\t\tprivate: $private\n\t\t\tnotes: $notes\n\t\t\thiddenFromStatusLists: $hiddenFromStatusLists\n\t\t\tstartedAt: $startedAt\n\t\t\tcompletedAt: $completedAt\n\t\t\tcustomLists: $customLists\n\t\t) {\n\t\t\tid\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddOneProgress($progress: Int, $status: MediaListStatus, $mediaId: Int) {\n\tSaveMediaListEntry(progress: $progress, status: $status, mediaId: $mediaId) {\n\t\tprogress\n\t\tstatus\n\t}\n}\n"): (typeof documents)["\nmutation AddOneProgress($progress: Int, $status: MediaListStatus, $mediaId: Int) {\n\tSaveMediaListEntry(progress: $progress, status: $status, mediaId: $mediaId) {\n\t\tprogress\n\t\tstatus\n\t}\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery MediaListCollection($userId: Int, $type: MediaType, $version: Int) {\n\t\tMediaListCollection(userId: $userId, type: $type) {\n\t\t\tlists {\n\t\t\t\tentries {\n\t\t\t\t\tid\n\t\t\t\t\tstatus\n\t\t\t\t\tmedia {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle {\n\t\t\t\t\t\t\tenglish\n\t\t\t\t\t\t\tromaji\n\t\t\t\t\t\t}\n\t\t\t\t\t\tcoverImage {\n\t\t\t\t\t\t\tlarge\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstatus(version: $version)\n\t\t\t\t\t\tnextAiringEpisode {\n\t\t\t\t\t\t\tairingAt\n\t\t\t\t\t\t\ttimeUntilAiring\n\t\t\t\t\t\t\tepisode\n\t\t\t\t\t\t}\n\t\t\t\t\t\tformat\n\t\t\t\t\t\tepisodes\n\t\t\t\t\t}\n\t\t\t\t\tprogress\n\t\t\t\t\trepeat\n\t\t\t\t\tscore\n\t\t\t\t}\n\t\t\t\tname\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery MediaListCollection($userId: Int, $type: MediaType, $version: Int) {\n\t\tMediaListCollection(userId: $userId, type: $type) {\n\t\t\tlists {\n\t\t\t\tentries {\n\t\t\t\t\tid\n\t\t\t\t\tstatus\n\t\t\t\t\tmedia {\n\t\t\t\t\t\tid\n\t\t\t\t\t\ttitle {\n\t\t\t\t\t\t\tenglish\n\t\t\t\t\t\t\tromaji\n\t\t\t\t\t\t}\n\t\t\t\t\t\tcoverImage {\n\t\t\t\t\t\t\tlarge\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstatus(version: $version)\n\t\t\t\t\t\tnextAiringEpisode {\n\t\t\t\t\t\t\tairingAt\n\t\t\t\t\t\t\ttimeUntilAiring\n\t\t\t\t\t\t\tepisode\n\t\t\t\t\t\t}\n\t\t\t\t\t\tformat\n\t\t\t\t\t\tepisodes\n\t\t\t\t\t}\n\t\t\t\t\tprogress\n\t\t\t\t\trepeat\n\t\t\t\t\tscore\n\t\t\t\t}\n\t\t\t\tname\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;