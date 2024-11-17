import { StyleSheet } from "react-native";
import { useToggle } from "../../components/ToggleContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function ExploreScreen() {
	const { isManga } = useToggle();

	return (
		<ThemedView style={styles.container}>
			<ThemedText>{isManga ? "Explore Manga" : "Explore Anime"}</ThemedText>
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
