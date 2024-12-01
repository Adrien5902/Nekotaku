import { TouchableOpacity } from "react-native";
import Icon, { type IconName } from "./Icon";
import { ThemedText } from "./ThemedText";
import { type Href, router } from "expo-router";
import { ThemedView, type Props as ThemedViewProps } from "./ThemedView";
import { Spacing } from "@/constants/Sizes";

export interface Props extends ThemedViewProps {
	title?: string;
	icon?: IconName;
	route: Href<string | object>;
}

export default function NavButton({
	title,
	icon,
	route,
	style,
	...props
}: Props) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => {
				router.navigate(route);
			}}
		>
			<ThemedView
				color="accent"
				{...props}
				style={[
					style,
					{
						borderRadius: Spacing.m,
						padding: Spacing.s,
						flexDirection: "row",
						gap: Spacing.s,
					},
				]}
			>
				{icon ? <Icon name={icon} /> : null}
				{title ? <ThemedText>{title}</ThemedText> : null}
				<Icon name="arrow-right" />
			</ThemedView>
		</TouchableOpacity>
	);
}
