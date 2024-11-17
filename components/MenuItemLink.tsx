import { Spacing, TextSizes } from "@/constants/Sizes";
import Icon, { type IconName } from "./Icon";
import { ThemedText } from "./ThemedText";
import { TouchableOpacity } from "react-native";
import { type Href, router } from "expo-router";
import { ThemedView } from "./ThemedView";
import { useThemeColors } from "@/hooks/useThemeColor";
import useStyles from "@/hooks/useStyles";

interface Props<T extends string | object> {
	name: string;
	route?: Href<T>;
	iconLeft: IconName;
}

export default function <T extends string | object>({
	name,
	route,
	iconLeft,
}: Props<T>) {
	const styles = useStyles();

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => {
				if (route) {
					router.navigate(route);
				}
			}}
		>
			<ThemedView style={[styles.PrimaryElement]}>
				<Icon name={iconLeft} size={TextSizes.l} />
				<ThemedText size="m">{name}</ThemedText>
				<Icon name={"chevron-right"} size={TextSizes.l} />
			</ThemedView>
		</TouchableOpacity>
	);
}
