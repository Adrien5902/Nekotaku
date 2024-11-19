import {
	Dimensions,
	Image,
	type ImageSourcePropType,
	type ImageStyle,
	View,
} from "react-native";
import { AspectRatios, Spacing, TextSizes } from "@/constants/Sizes";

export interface Props {
	text: React.ReactNode;
	bannerSource?: ImageSourcePropType;
	avatarSource?: ImageSourcePropType;
	avatarAspectRatio: number;
	avatarStyle?: ImageStyle;
}

export default function BannerTitleDisplay({
	text,
	bannerSource,
	avatarSource,
	avatarAspectRatio,
	avatarStyle,
}: Props) {
	const { width } = Dimensions.get("window");

	return (
		<View>
			{bannerSource ? (
				<Image
					source={bannerSource}
					style={{
						width,
						aspectRatio: AspectRatios.banner,
						position: "absolute",
					}}
				/>
			) : null}
			<View
				style={{
					marginTop:
						width / AspectRatios.banner - avatarAspectRatio * (width / 8),
					marginHorizontal: Spacing.l,
					flexDirection: "row",
					alignItems: "flex-end",
				}}
			>
				<Image
					source={avatarSource ?? undefined}
					style={[
						{
							width: width / 4,
							aspectRatio: avatarAspectRatio,
							borderRadius: Spacing.m,
						},
						avatarStyle,
					]}
				/>
				<View
					style={{
						margin: Spacing.l,
						marginBottom: Spacing.s,
						flex: 1,
					}}
				>
					{text}
				</View>
			</View>
		</View>
	);
}
