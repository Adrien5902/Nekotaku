import { ThemedText } from "@/components/ThemedText";
import useLang from "@/hooks/useLang";
import useStyles from "@/hooks/useStyles";
import { useThemeColors } from "@/hooks/useThemeColor";
import React, { useEffect, useState } from "react";
import { TouchableHighlight, View } from "react-native";
import GoogleCast, {
	useCastDevice,
	type Device,
} from "react-native-google-cast";

export enum ConnectionState {
	Connected = "Connected",
	NotConnected = "NotConnected",
	Connecting = "Connecting",
	CantConnect = "CantConnect",
}

export interface Props {
	device: Device;
	onConnected?: () => void;
	onFailedToConnect?: () => void;
}

export default function DeviceSelector({
	device,
	onConnected,
	onFailedToConnect,
}: Props) {
	const lang = useLang();
	const styles = useStyles();
	const colors = useThemeColors();
	const connectedDevice = useCastDevice();
	const SessionManager = GoogleCast.getSessionManager();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setConnectionState(
			connectedDevice?.deviceId === device.deviceId
				? ConnectionState.Connected
				: ConnectionState.NotConnected,
		);
	}, [connectedDevice]);

	const [connectionState, setConnectionState] = useState(
		connectedDevice?.deviceId === device.deviceId
			? ConnectionState.Connected
			: ConnectionState.NotConnected,
	);

	return (
		<TouchableHighlight
			onPress={async () => {
				if (connectionState !== ConnectionState.Connected) {
					try {
						setConnectionState(ConnectionState.Connecting);
						await SessionManager.startSession(device.deviceId);
						setConnectionState(ConnectionState.Connected);
						if (onConnected) onConnected();
					} catch (error) {
						setConnectionState(ConnectionState.CantConnect);
						if (onFailedToConnect) onFailedToConnect();
					}
				}
			}}
		>
			<View
				style={[
					styles.PrimaryElement,
					{ flexDirection: "column", borderColor: colors.text },
				]}
			>
				<ThemedText size="m" weight="bold" key={device.deviceId}>
					{device.friendlyName} - {device.modelName}
				</ThemedText>
				<ThemedText
					color={
						connectionState === ConnectionState.Connected
							? "accent"
							: connectionState === ConnectionState.CantConnect
								? "alert"
								: "text"
					}
				>
					{connectionState !== ConnectionState.NotConnected
						? lang.pages.player.remoteMediaCast.connectionState[connectionState]
						: lang.pages.player.remoteMediaCast.connectPrompt}
				</ThemedText>
			</View>
		</TouchableHighlight>
	);
}
