import Icon from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing, TextSizes } from "@/constants/Sizes";
import { LinearGradient } from "expo-linear-gradient";
import React, {
	forwardRef,
	useRef,
	useState,
	useImperativeHandle,
} from "react";
import { View, useAnimatedValue, Animated, Easing } from "react-native";
import usePlayerContext from "../PlayerContextProvider";
import { useControlsContext } from "./useControlsContext";

export type DoubleTapQuickForwardIndicatorRef = {
	quickForwardDoubleTap: (rightOrLeft: boolean) => void;
};

export const DoubleTapQuickForwardIndicator =
	forwardRef<DoubleTapQuickForwardIndicatorRef>((_props, ref) => {
		const { playerRef, playerStyle } = usePlayerContext();
		const { currentStatus } = useControlsContext();

		const timeChangeInterval = 10000;

		const forwardGradientContainerRef = useRef<View>(null);
		const forwardGradientOpacityAnim = useAnimatedValue(0);
		const [rightOrLeft, setRightOrLeft] = useState(true);

		function onQuickForwardDoubleTap(rightOrLeft: boolean) {
			setRightOrLeft(rightOrLeft);

			Animated.timing(forwardGradientOpacityAnim, {
				toValue: 1,
				duration: 150,
				easing: Easing.ease,
				useNativeDriver: true,
			}).start();
			setTimeout(() => {
				Animated.timing(forwardGradientOpacityAnim, {
					toValue: 0,
					duration: 500,
					easing: Easing.quad,
					useNativeDriver: true,
				}).start();
			}, 150);

			playerRef.current?.setPositionAsync(
				(currentStatus?.positionMillis ?? 0) +
					timeChangeInterval * (rightOrLeft ? 1 : -1),
			);
		}

		useImperativeHandle(ref, () => ({
			quickForwardDoubleTap: onQuickForwardDoubleTap,
		}));

		return (
			<Animated.View
				style={{
					...playerStyle,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					position: "absolute",
					flex: 1,
					zIndex: 3,
					opacity: forwardGradientOpacityAnim,
					pointerEvents: "none",
				}}
				ref={forwardGradientContainerRef}
			>
				<LinearGradient
					colors={["#000000ff", "#000000cc", "#00000000"]}
					start={{ x: rightOrLeft ? 1 : 0, y: 1 }}
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: rightOrLeft ? "flex-end" : "flex-start",
					}}
				>
					<View
						style={{
							position: "absolute",
							padding: Spacing.xxl,
							alignItems: "center",
						}}
					>
						<Icon
							name={rightOrLeft ? "forward" : "backward"}
							size={TextSizes.xl}
							color={Colors.dark.text}
						/>
						<ThemedText style={{ color: Colors.dark.text }} weight="bold">
							{timeChangeInterval / 1000}s
						</ThemedText>
					</View>
					<View style={{ flex: 1 }} />
				</LinearGradient>
			</Animated.View>
		);
	});
