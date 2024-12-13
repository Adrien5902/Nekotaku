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

export const millisToTimeStamp = (millis: number) => {
    const s = Math.floor(millis / 1000);
    const hours = Math.floor(s / (60 * 60));
    const minutes = Math.floor(s / 60) % 60;
    const seconds = s % 60;
    const paddingZero = (n: number) => (n < 10 ? `0${n}` : n.toString());
    const display = (n: number) => (n !== 0 ? `${paddingZero(n)}:` : "");

    return `${display(hours)}${paddingZero(minutes)}:${paddingZero(seconds)}`;
};