import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal as ReactModal, TouchableHighlight, View } from "react-native";
import { Spacing } from "@/constants/Sizes";
import { useThemeColors } from "../hooks/useThemeColor";
import type { Color } from "@/constants/Colors";

export interface ModalProps {
	children?: React.ReactNode;
	title?: string;
	buttons?: { title: string; color?: Color; onPress?: () => void }[];
	closeButton?: string;
}

export interface ModalState {
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = forwardRef<ModalState, ModalProps>(
	({ closeButton, children, buttons, title }, ref) => {
		const [visible, setVisible] = useState(false);
		const colors = useThemeColors();

		useImperativeHandle(ref, () => ({
			setVisible,
		}));

		const b: ModalProps["buttons"] = [
			...(buttons ?? []),
			...(closeButton
				? [
						{
							title: closeButton,
							color: "text" as Color,
							onPress: () => setVisible(false),
						},
					]
				: []),
		];

		return (
			<>
				<ReactModal
					visible={visible}
					transparent
					onRequestClose={() => {
						setVisible(false);
					}}
				>
					<View
						style={{ backgroundColor: `${colors.background}aa`, flex: 1 }}
					/>
				</ReactModal>

				<ReactModal
					visible={visible}
					animationType="slide"
					transparent={true}
					onRequestClose={() => {
						setVisible(false);
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
				</ReactModal>
			</>
		);
	},
);
export default Modal;
