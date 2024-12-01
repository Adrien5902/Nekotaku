export interface VideoPlayStatus {
    positionMillis: number;
    durationMillis?: number;
    isPlaying: boolean;
}

export interface PlayerFunctions {
    playAsync(): Promise<void>;
    pauseAsync(): Promise<void>;
    setPositionAsync(positionMillis: number): Promise<void>;
    setPlaybackSpeedAsync(value: number): Promise<void>
}
