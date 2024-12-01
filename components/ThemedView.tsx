import type { Color } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Animated, View, type ViewProps } from "react-native";

export interface Props extends ViewProps {
	color?: Color;
}

export function ThemedView({ style, color, ...otherProps }: Props) {
	const backgroundColor = useThemeColors()[color ?? "background"];

	return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function AnimatedThemedView({ style, color, ...otherProps }: Props) {
	const backgroundColor = useThemeColors()[color ?? "background"];

	return <Animated.View style={[{ backgroundColor }, style]} {...otherProps} />;
}
