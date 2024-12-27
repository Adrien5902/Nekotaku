import type { VideoPlayStatus } from "@/types/Player";
import { createContext, useContext } from "react";

export interface Context {
	currentStatus: VideoPlayStatus | undefined;
	shouldDisplayControls: boolean;
}

export const ControlsContext = createContext<Context>({
	currentStatus: undefined,
	shouldDisplayControls: true,
});

export const useControlsContext = () => useContext(ControlsContext);

export function ControlsContextProvider(
	props: Context & { children: React.ReactNode },
) {
	return (
		<ControlsContext.Provider value={props}>
			{props.children}
		</ControlsContext.Provider>
	);
}
