import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
	DoubleTapQuickForwardIndicator,
	type DoubleTapQuickForwardIndicatorRef,
} from "./DoubleTapQuickForwardIndicator";
import usePlayerContext from "../PlayerContextProvider";
import { ControlsContextProvider } from "./useControlsContext";
import {
	Dimensions,
	type GestureResponderEvent,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { PoppingControls } from "./PoppingControls";
import { AniskipButton } from "./AniskipButton";
import { useDoublePress } from "@/hooks/useDoublePress";

export default function Controls() {
	const { loading, forceViewControls } = usePlayerContext();

	const { statusRef } = usePlayerContext();

	const [currentStatus, setCurrentStatus] = useState(
		statusRef.current ?? undefined,
	);

	useEffect(() => {
		const interval = setInterval(() => {
			if (statusRef.current) {
				setCurrentStatus({ ...statusRef.current });
			}
		}, 500);

		return () => clearInterval(interval);
	}, [statusRef]);

	const doubleTapRef = useRef<DoubleTapQuickForwardIndicatorRef>(null);
	function doubleTapForward(rightOrLeft: boolean) {
		doubleTapRef.current?.quickForwardDoubleTap(rightOrLeft);
	}

	const [viewControls, setViewControls] = useState(true);

	const shouldDisplayControls =
		(loading || viewControls || forceViewControls) ?? true;

	const { playerStyle } = usePlayerContext();

	const onPress = useDoublePress<GestureResponderEvent>(
		() => {
			if (viewControls) {
				setTimeout(() => setViewControls(false), 6000);
			}
			setViewControls((c) => !c);
		},
		(e) => {
			const { locationX } = e.nativeEvent;

			const { width } = Dimensions.get("screen");
			const rightOrLeft = locationX / width > 0.5;
			doubleTapForward(rightOrLeft);
		},
	);

	return (
		<ControlsContextProvider {...{ currentStatus, shouldDisplayControls }}>
			<TouchableWithoutFeedback onPress={onPress}>
				<View
					style={{
						...playerStyle,
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
						position: "absolute",
						flex: 1,
						zIndex: 2,
					}}
				>
					<PoppingControls {...{ viewControls }}>
						<AniskipButton />
					</PoppingControls>
				</View>
			</TouchableWithoutFeedback>
			<DoubleTapQuickForwardIndicator ref={doubleTapRef} />
		</ControlsContextProvider>
	);
}
