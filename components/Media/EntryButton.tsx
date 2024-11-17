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
import type { MediaList } from "@/types/Anilist";
import useStyles from "@/hooks/useStyles";

interface Props {
	entry: MediaList;
}

function EntryButton({ entry }: Props) {
	const styles = useStyles();
	return (
		<TouchableOpacity
			onPress={() => {
				router.navigate(`/media_details/${entry.id ?? 0}` as Href<string>);
			}}
			activeOpacity={0.7}
		>
			<ThemedView style={[styles.PrimaryElement, { flex: 1, padding: 0 }]}>
				<Image
					source={{ uri: entry.media?.coverImage?.large ?? undefined }}
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
					<ThemedText numberOfLines={1}>
						{entry.media?.title?.english ?? entry.media?.title?.romaji}
					</ThemedText>

					<MediaListStatusDisplay mediaList={entry} />

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
						{entry.progress && entry.media?.episodes ? (
							<ThemedView
								color="accent"
								style={{
									height: 5,
									width: `${(entry.progress / entry.media?.episodes) * 100}%`,
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
							{entry.score ? (
								<ThemedText>
									{entry.score}
									<Icon size={TextSizes.m} name="star-half-stroke" />
								</ThemedText>
							) : null}
						</View>
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
								{entry.repeat ? (
									<ThemedText>
										{entry.repeat}
										<Icon size={TextSizes.m} name="repeat" />
									</ThemedText>
								) : null}
								<ThemedText>
									{entry.progress}/{entry.media?.episodes}
								</ThemedText>
								{entry.progress !== entry.media?.episodes ? (
									<ThemedText>
										{" "}
										<Icon size={TextSizes.m} name="plus" />
									</ThemedText>
								) : null}
							</View>
						</TouchableHighlight>
					</View>
				</View>
			</ThemedView>
		</TouchableOpacity>
	);
}

export default EntryButton;
