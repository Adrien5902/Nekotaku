import {
	Image,
	TouchableHighlight,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { type Href, router } from "expo-router";
import MediaListStatusDisplay from "./Status";
import Icon from "../Icon";
import { AspectRatios, Spacing, TextSizes } from "@/constants/Sizes";
import type { Media, MediaList, MediaRelation } from "@/types/Anilist/graphql";
import useStyles from "@/hooks/useStyles";

export interface Props {
	media?:
		| Pick<
				Media,
				"id" | "episodes" | "coverImage" | "title" | "status" | "format"
		  >
		| null
		| undefined;
	mediaList?:
		| Pick<MediaList, "progress" | "score" | "repeat" | "status">
		| null
		| undefined;
	relationType?: MediaRelation | null | undefined;
}

function EntryButton({ media, mediaList, relationType }: Props) {
	const styles = useStyles();
	return (
		<TouchableOpacity
			onPress={() => {
				router.push(`/media_details/${media?.id ?? 0}` as Href<string>);
			}}
			activeOpacity={0.7}
		>
			<ThemedView style={[styles.PrimaryElement, { flex: 1, padding: 0 }]}>
				<Image
					source={{ uri: media?.coverImage?.large ?? undefined }}
					style={{ width: 80, aspectRatio: AspectRatios.cover }}
					progressiveRenderingEnabled={true}
				/>
				<View
					style={{
						paddingHorizontal: Spacing.m,
						flex: 1,
						height: "100%",
						justifyContent: "space-around",
					}}
				>
					<View style={{ flexDirection: "row" }}>
						{relationType ? (
							<>
								<ThemedText color="accent">{relationType}</ThemedText>
								<ThemedText> • </ThemedText>
							</>
						) : null}
						<ThemedText numberOfLines={1}>
							{media?.title?.english ?? media?.title?.romaji}
						</ThemedText>
					</View>

					<MediaListStatusDisplay mediaList={mediaList} media={media} />

					<ThemedView
						color="primary"
						style={{
							height: Spacing.s,
							justifyContent: "center",
							width: "100%",
							borderRadius: Spacing.s,
							overflow: "hidden",
						}}
					>
						{mediaList?.progress && media?.episodes ? (
							<ThemedView
								color="accent"
								style={{
									height: 5,
									width: `${(mediaList.progress / media?.episodes) * 100}%`,
								}}
							/>
						) : null}
					</ThemedView>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<View>
							{mediaList?.score ? (
								<ThemedText>
									{mediaList?.score}
									<Icon size={TextSizes.m} name="star-half-stroke" />
								</ThemedText>
							) : null}
						</View>
						{mediaList?.repeat ? (
							<ThemedText>
								{mediaList?.repeat}
								<Icon size={TextSizes.m} name="repeat" />
							</ThemedText>
						) : null}
						{media?.episodes && mediaList?.progress ? (
							<TouchableHighlight
								onPress={() => {
									Vibration.vibrate([70, 40]);
								}}
								style={{
									borderRadius: Spacing.s,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										padding: Spacing.xs,
									}}
								>
									<ThemedText>
										{mediaList.progress}/{media.episodes}
									</ThemedText>
									{mediaList.progress !== media.episodes ? (
										<ThemedText>
											{" "}
											<Icon size={TextSizes.m} name="plus" />
										</ThemedText>
									) : null}
								</View>
							</TouchableHighlight>
						) : null}
					</View>
				</View>
			</ThemedView>
		</TouchableOpacity>
	);
}

export default EntryButton;
