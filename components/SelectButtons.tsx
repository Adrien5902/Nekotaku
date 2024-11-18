import { useState } from "react";
import {
	ScrollView,
	type TextStyle,
	TouchableHighlight,
	View,
	type ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Spacing, TextSizes } from "@/constants/Sizes";
import Icon from "./Icon";

interface Props<T extends string> {
	buttonStyle?: ViewStyle;
	activeStyle?: ViewStyle;
	textStyle?: TextStyle;
	activeTextStyle?: TextStyle;
	buttons: T[];
	defaultValue?: T;
	onValueChange: (newVal: T) => void;
	checkMark?: boolean;
}

export function SelectButtons<T extends string>({
	defaultValue,
	buttonStyle,
	textStyle,
	buttons,
	onValueChange,
	activeStyle,
	activeTextStyle,
	checkMark,
}: Props<T>) {
	const colors = useThemeColors();
	const [value, setValue] = useState(defaultValue ?? buttons[0]);

	return (
		<ScrollView horizontal={true}>
			{buttons.map((buttonName) => {
				const active = value === buttonName;

				const buttonStyle2 = [
					buttonStyle ?? {
						marginHorizontal: Spacing.m,
						marginBottom: Spacing.m,
						padding: Spacing.m,
						borderRadius: Spacing.s,
						borderColor: colors.text,
						borderWidth: Spacing.xs,
					},
				];

				const textStyle2 = [textStyle ?? { color: colors.text }];

				if (active) {
					buttonStyle2.push(
						activeStyle ?? {
							backgroundColor: colors.accent,
							borderColor: colors.accent,
						},
					);

					textStyle2.push(
						activeTextStyle ?? {
							color: colors.background,
							fontWeight: "800",
						},
					);
				}

				return (
					<TouchableHighlight
						onPress={() => {
							onValueChange(buttonName);
							setValue(buttonName);
						}}
						key={buttonName}
						style={buttonStyle2}
						underlayColor={colors.primary}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							{active && checkMark ? (
								<Icon
									name="check"
									style={[textStyle2, { paddingRight: Spacing.s }]}
									size={TextSizes.s}
								/>
							) : null}
							<ThemedText style={textStyle2}>{buttonName}</ThemedText>
						</View>
					</TouchableHighlight>
				);
			})}
		</ScrollView>
	);
}
