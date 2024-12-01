import useStyles from "@/hooks/useStyles";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useState } from "react";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { TextSizes } from "@/constants/Sizes";
import type IconName from "@expo/vector-icons/build/FontAwesome";

export interface BooleanInputProps {
	defaultValue: boolean;
	onChange: (newVal: boolean) => unknown;
	activeIcon?: keyof (typeof IconName)["glyphMap"];
	inactiveIcon?: keyof (typeof IconName)["glyphMap"];
	title: string;
}

export function BooleanInput({
	defaultValue,
	onChange,
	activeIcon,
	inactiveIcon,
	title,
}: BooleanInputProps) {
	const styles = useStyles();
	const colors = useThemeColors();
	const [isTrue, setIsTrue] = useState(defaultValue);

	return (
		<View
			style={[
				styles.PrimaryElement,
				{ flexDirection: "row", borderColor: colors.text },
			]}
			onTouchEnd={() => {
				onChange(!isTrue);
				setIsTrue((t) => !t);
			}}
		>
			<ThemedText style={{ flex: 1 }}>{title}</ThemedText>
			<FontAwesome
				size={TextSizes.l}
				name={
					isTrue ? (activeIcon ?? "check-square") : (inactiveIcon ?? "square-o")
				}
				color={isTrue ? colors.accent : colors.text}
			/>
		</View>
	);
}
