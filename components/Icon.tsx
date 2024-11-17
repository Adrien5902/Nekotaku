import { useThemeColors } from "@/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import {
	Animated,
	TouchableWithoutFeedback,
	type ColorValue,
} from "react-native";
import { TextSizes } from "@/constants/Sizes";
import type { SvgProps } from "react-native-svg";
import { PlayDownloadedButton } from "@/assets/icons/PlayDownloaded";

export type IconName = FontAwesomeIconProps["icon"];

interface Props<T> extends SvgProps {
	name: IconName | T;
	source?: string;
	size?: number;
	color?: ColorValue;
}

const customIcons = {
	"play-downloaded": PlayDownloadedButton,
};

export const FontAwesomeAnimatedIcon =
	Animated.createAnimatedComponent(FontAwesome6);

export default function Icon({
	name,
	source,
	size,
	color,
	onPress,
	...props
}: Props<keyof typeof customIcons>) {
	const colors = useThemeColors();

	const CustomIcon = customIcons[name as keyof typeof customIcons];
	if (CustomIcon) {
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<CustomIcon
					style={{
						width: size ?? TextSizes.xl,
						height: size ?? TextSizes.xl,
						justifyContent: "center",
						alignItems: "center",
					}}
					fill={color ?? colors.text}
				/>
			</TouchableWithoutFeedback>
		);
	}

	return (
		<FontAwesome6
			onPress={onPress}
			name={name}
			size={size ?? TextSizes.l}
			color={color ?? colors.text}
			{...props}
		/>
	);
}

export function AnimatedIcon({
	name,
	source,
	size,
	color,
	onPress,
	...props
}: Props<never>) {
	const colors = useThemeColors();

	return (
		<FontAwesomeAnimatedIcon
			onPress={onPress}
			name={name}
			size={size ?? TextSizes.l}
			color={color ?? colors.text}
			{...props}
		/>
	);
}
