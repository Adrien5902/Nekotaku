import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Modal, TouchableHighlight, View } from "react-native";
import { Spacing } from "@/constants/Sizes";
import { useThemeColors } from "./useThemeColor";
import type { Color } from "@/constants/Colors";

export interface Props {
	text?: string | JSX.Element;
	buttons?: { title: string; color?: Color; onPress?: () => void }[];
}

export default function useModal(closeButton?: string) {
	const [modalVisible, setModalVisible] = useState(false);
	const colors = useThemeColors();

	const modal = ({ text, buttons }: Props) => {
		const b: Props["buttons"] = [
			...(buttons ?? []),
			...(closeButton
				? [
						{
							title: closeButton,
							color: "alert" as Color,
							onPress: () => setModalVisible(false),
						},
					]
				: []),
		];
		return (
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => {
					setModalVisible(false);
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ThemedView
						color="primary"
						style={{ padding: Spacing.l, borderRadius: Spacing.m }}
					>
						{text ? <ThemedText>{text}</ThemedText> : null}

						<View
							style={{
								paddingTop: Spacing.m,
								paddingRight: Spacing.m,
								gap: Spacing.l,
								flexDirection: "row",
								justifyContent: "flex-end",
							}}
						>
							{b?.map((button) => (
								<TouchableHighlight
									underlayColor={colors.secondary}
									style={{ padding: Spacing.s, borderRadius: Spacing.m }}
									key={button.title}
									onPress={button.onPress}
								>
									<ThemedText color={button.color} weight="bold">
										{button.title}
									</ThemedText>
								</TouchableHighlight>
							))}
						</View>
					</ThemedView>
				</View>
			</Modal>
		);
	};

	return { modal, setModalVisible };
}
