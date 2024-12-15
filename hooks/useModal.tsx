import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Dimensions, Modal, TouchableHighlight, View } from "react-native";
import { Spacing } from "@/constants/Sizes";
import { useThemeColors } from "./useThemeColor";
import type { Color } from "@/constants/Colors";

export interface Props {
	children?: string | JSX.Element;
	title?: string;
	buttons?: { title: string; color?: Color; onPress?: () => void }[];
}

export default function useModal(closeButton?: string) {
	const [modalVisible, setModalVisible] = useState(false);
	const colors = useThemeColors();

	const modal = ({ children, buttons, title }: Props) => {
		const b: Props["buttons"] = [
			...(buttons ?? []),
			...(closeButton
				? [
						{
							title: closeButton,
							color: "text" as Color,
							onPress: () => setModalVisible(false),
						},
					]
				: []),
		];

		return (
			<>
				<Modal
					visible={modalVisible}
					transparent
					onRequestClose={() => {
						setModalVisible(false);
					}}
				>
					<View
						style={{ backgroundColor: `${colors.background}aa`, flex: 1 }}
					/>
				</Modal>

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
							{title ? (
								<ThemedText size="m" weight="bold">
									{title}
								</ThemedText>
							) : null}
							{children ? (
								typeof children === "string" ? (
									<ThemedText>{children}</ThemedText>
								) : (
									children
								)
							) : null}

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
			</>
		);
	};

	return { modal, setModalVisible };
}
