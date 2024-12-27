import type { Media, MediaTitle } from "@/types/Anilist/graphql";
import type { Episode } from "@/types/AnimeSama";
import type { PlayerFunctions, VideoPlayStatus } from "@/types/Player";
import type React from "react";
import { createContext, useContext } from "react";
import type { ViewStyle } from "react-native";

export const PlayerContext = createContext<PlayerContextT>({
	episode: undefined,
	isFullscreen: false,
	loading: true,
	setIsLoadingVid: () => {},
	media: undefined,
	playerRef: { current: undefined },
	setSettingsVisible: () => {},
	statusRef: { current: undefined },
	toggleFullscreen: () => {},
	forceViewControls: true,
	playerStyle: {},
});
export interface PlayerContextT {
	playerRef: React.MutableRefObject<PlayerFunctions | undefined>;
	statusRef: React.MutableRefObject<VideoPlayStatus | undefined>;
	loading: boolean;
	setIsLoadingVid: React.Dispatch<React.SetStateAction<boolean>>;
	isFullscreen: boolean;
	episode?: Episode;
	media:
		| (Pick<Media, "idMal" | "id"> & {
				title?: Pick<MediaTitle, "romaji" | "english"> | undefined | null;
		  })
		| undefined
		| null;
	toggleFullscreen: (force?: boolean) => void;
	forceViewControls?: boolean;
	setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	playerStyle: Partial<ViewStyle>;
}

export function PlayerContextProvider(
	props: PlayerContextT & { children: React.ReactNode },
) {
	return (
		<PlayerContext.Provider value={props}>
			{props.children}
		</PlayerContext.Provider>
	);
}

const usePlayerContext = () => useContext(PlayerContext);
export default usePlayerContext;
