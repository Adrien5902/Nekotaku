import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import {
	Animated,
	type LayoutChangeEvent,
	TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { AnimatedThemedView, ThemedView } from "@/components/ThemedView";
import { AnimatedIcon } from "./Icon";
import { TextSizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";

export function Collapsible({
	children,
	title,
}: PropsWithChildren & { title: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [contentHeight, setContentHeight] = useState(0);

	const chevronAnimData = useRef(new Animated.Value(0)).current;
	const heightAnimData = useRef(new Animated.Value(Number.MAX_VALUE)).current;

	function toggleOpen() {
		Animated.timing(chevronAnimData, {
			toValue: isOpen ? 0 : 1,
			duration: 200,
			useNativeDriver: true,
		}).start();

		Animated.timing(heightAnimData, {
			toValue: isOpen ? 0 : contentHeight,
			duration: 200,
			useNativeDriver: false,
		}).start();

		setIsOpen((o) => !o);
	}

	const chevronAnim = chevronAnimData.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "90deg"],
	});

	const onContentLayout = (event: LayoutChangeEvent) => {
		if (contentHeight === 0) {
			setContentHeight(event.nativeEvent.layout.height);
			heightAnimData.setValue(isOpen ? event.nativeEvent.layout.height : 0);
		}
	};

	const styles = useStyles();

	return (
		<ThemedView
			style={[
				styles.PrimaryElement,
				{ flexDirection: "column", alignItems: "flex-start" },
			]}
		>
			<TouchableOpacity
				onPress={toggleOpen}
				activeOpacity={0.8}
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<ThemedText size="m" style={{ flex: 1 }}>
					{title}
				</ThemedText>
				<AnimatedIcon
					size={TextSizes.m}
					name="chevron-right"
					style={{ transform: [{ rotate: chevronAnim }] }}
				/>
			</TouchableOpacity>
			<AnimatedThemedView
				style={{
					overflow: "hidden",
					maxHeight: heightAnimData,
					marginTop: 6,
					marginLeft: 24,
					alignItems: "flex-start",
				}}
				onLayout={onContentLayout}
			>
				{children}
			</AnimatedThemedView>
		</ThemedView>
	);
}
