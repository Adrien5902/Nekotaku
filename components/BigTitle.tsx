import { Spacing, TextSizes } from "@/constants/Sizes";
import { ThemedText } from "./ThemedText";
import Icon, { type IconName } from "./Icon";
import { View } from "react-native";

export default function BigTitle({
	title,
	icon,
}: { title: string; icon: IconName }) {
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				marginBottom: Spacing.m,
			}}
		>
			<Icon name={icon} size={TextSizes.xxl * 1.5} />
			<ThemedText size="l">{title}</ThemedText>
		</View>
	);
}
