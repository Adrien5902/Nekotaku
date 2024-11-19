import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import Icon, { type IconName } from "../Icon";
import useStyles from "@/hooks/useStyles";
import { Spacing } from "@/constants/Sizes";
import type { Media } from "@/types/Anilist/graphql";

export interface Props {
	media?:
		| Pick<Media, "popularity" | "favourites" | "meanScore" | "averageScore">
		| null
		| undefined;
}

export default function MediaStats({ media }: Props) {
	const styles = useStyles();
	return (
		<ThemedView style={styles.PrimaryElement}>
			<Child icon={"users"} data={media?.popularity} />
			<Child icon={"heart"} data={media?.favourites} />
			<Child icon={"star-half-stroke"} data={media?.meanScore} />
			<Child icon={"percentage"} data={media?.averageScore} />
		</ThemedView>
	);
}

function Child({ icon, data }: { icon: IconName; data?: number | null }) {
	return (
		<ThemedView
			style={{
				justifyContent: "center",
				alignItems: "center",
				paddingHorizontal: Spacing.m,
			}}
		>
			<Icon name={icon} />
			<ThemedText weight="bold">
				{data?.toLocaleString().replaceAll(",", " ")}
			</ThemedText>
		</ThemedView>
	);
}
