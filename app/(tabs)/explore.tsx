import { StyleSheet } from "react-native";
import { useToggle } from "../../components/ToggleContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MediaType } from "@/types/Anilist/graphql";

export default function ExploreScreen() {
	const { appMode } = useToggle();

	return (
		<ThemedView style={styles.container}>
			<ThemedText>
				{appMode === MediaType.Manga ? "Explore Manga" : "Explore Anime"}
			</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
