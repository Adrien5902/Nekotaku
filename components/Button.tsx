import {
	type GestureResponderEvent,
	type TextStyle,
	TouchableOpacity,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import Icon, { type IconName } from "./Icon";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Spacing, type TextSizes } from "@/constants/Sizes";
import type { Color } from "@/constants/Colors";

export interface CustomButtonProps extends ViewProps {
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
	iconName?: IconName;
	textStyle?: TextStyle;
	textSize?: keyof typeof TextSizes;
	textColor?: Color;
	backgroundColor?: Color;
	backgroundStyle?: ViewStyle;
}

export default function CustomButton({
	onPress,
	iconName,
	children,
	textStyle,
	textColor,
	textSize,
	backgroundColor,
	backgroundStyle,
	...props
}: CustomButtonProps) {
	return (
		<TouchableOpacity onPress={onPress}>
			<ThemedView
				{...props}
				style={[
					backgroundStyle,
					{
						margin: Spacing.m,
						padding: Spacing.m,
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "row",
						borderRadius: Spacing.s,
					},
				]}
				color={backgroundColor}
			>
				{iconName ? <Icon name={iconName} /> : null}
				{typeof children === "string" ? (
					<ThemedText
						style={textStyle}
						size={textSize ?? "m"}
						color={textColor}
						weight="bold"
					>
						{children}
					</ThemedText>
				) : (
					children
				)}
			</ThemedView>
		</TouchableOpacity>
	);
}
