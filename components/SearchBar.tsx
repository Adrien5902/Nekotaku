import { Spacing, TextSizes } from "@/constants/Sizes";
import { ThemedView } from "./ThemedView";
import Icon from "./Icon";
import { TextInput } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import useLang from "@/hooks/useLang";
import { useState } from "react";

export interface Props {
	onValueChange?: (value: string) => void;
	onEndEditing?: (value: string) => void;
}

export default function SearchBar({ onValueChange, onEndEditing }: Props) {
	const [searchValue, setSearchValue] = useState<string>();
	const [clearTextVisible, setClearTextVisible] = useState(false);
	const colors = useThemeColors();
	const lang = useLang();

	return (
		<ThemedView
			style={{
				flex: 1,
				padding: Spacing.m,
				borderRadius: Spacing.m,
				justifyContent: "center",
			}}
		>
			<TextInput
				selectionColor={colors.accent}
				selectionHandleColor={colors.accent}
				cursorColor={colors.accent}
				style={{
					color: colors.text,
					fontSize: TextSizes.m,
				}}
				placeholderTextColor={colors.text}
				placeholder={lang.misc.searchPlaceholder}
				// This is used only to clear the input when clicking the X
				value={searchValue}
				onChange={(event) => {
					if (event.nativeEvent.text) {
						setClearTextVisible(true);
					} else {
						setClearTextVisible(false);
					}

					if (onValueChange) onValueChange(event.nativeEvent.text);
				}}
				onEndEditing={(event) => {
					if (onEndEditing) onEndEditing(event.nativeEvent.text);
				}}
			/>
			{clearTextVisible ? (
				<ThemedView
					color="text"
					style={{
						position: "absolute",
						borderRadius: Spacing.xl,
						aspectRatio: 1,
						justifyContent: "center",
						alignItems: "center",
						right: Spacing.m,
						width: TextSizes.m,
						height: TextSizes.m,
					}}
					onTouchEnd={() => {
						setClearTextVisible(false);
						if (onValueChange) onValueChange("");
						if (onEndEditing) onEndEditing("");

						// Used to clear the input
						setSearchValue("");
						setTimeout(() => {
							setSearchValue(undefined);
						});
					}}
				>
					<Icon name="xmark" color={colors.background} size={TextSizes.m} />
				</ThemedView>
			) : null}
		</ThemedView>
	);
}
