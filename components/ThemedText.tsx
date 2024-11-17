import type { Color } from "@/constants/Colors";
import { TextSizes } from "@/constants/Sizes";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Text, type TextStyle, type TextProps } from "react-native";

export interface ThemedTextProps extends TextProps {
	size?: keyof typeof TextSizes;
	color?: Color;
	weight?: TextStyle["fontWeight"];
}

export function ThemedText({
	style,
	color,
	size,
	weight,
	...otherProps
}: ThemedTextProps) {
	const textColor = useThemeColors()[color ?? "text"];

	return (
		<Text
			style={[
				{
					color: textColor,
					fontFamily: "Roboto",
					fontSize: size ? TextSizes[size] : undefined,
					fontWeight: weight,
				},
				style,
			]}
			{...otherProps}
		/>
	);
}
