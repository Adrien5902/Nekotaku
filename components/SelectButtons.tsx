import { useState } from "react";
import {
	type TextStyle,
	TouchableHighlight,
	View,
	type ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";

interface Props {
	buttonStyle: ViewStyle;
	activeStyle: ViewStyle;
	textStyle: TextStyle;
	activeTextStyle: TextStyle;
	buttons: string[];
	defaultValue?: string;
	onValueChange: (newVal: string) => void;
}

export function SelectButtons({
	defaultValue,
	buttonStyle,
	textStyle,
	buttons,
	onValueChange,
	activeStyle,
	activeTextStyle,
}: Props) {
	const colors = useThemeColors();
	const [value, setValue] = useState(defaultValue ?? buttons[0]);

	return (
		<View style={{ flexDirection: "row" }}>
			{buttons.map((buttonName) => {
				const active = value === buttonName;
				return (
					<TouchableHighlight
						onPress={() => {
							onValueChange(buttonName);
							setValue(buttonName);
						}}
						key={buttonName}
						style={active ? { ...buttonStyle, ...activeStyle } : buttonStyle}
						underlayColor={colors.primary}
					>
						<ThemedText
							style={active ? { ...textStyle, ...activeTextStyle } : textStyle}
						>
							{buttonName}
						</ThemedText>
					</TouchableHighlight>
				);
			})}
		</View>
	);
}
