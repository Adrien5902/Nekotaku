import { getVideoUri } from "@/hooks/useGetVideoSource";
import * as FileSystem from "expo-file-system";
import { createContext, type ReactNode } from "react";
import notifee, {
	AndroidImportance,
	type Event as NotificationEvent,
	type Notification,
} from "@notifee/react-native";
import type { Media } from "@/types/Anilist";
import { Colors } from "@/constants/Colors";
import type { Episode, EpisodeId } from "@/types/AnimeSama";

export class Downloader {
	currentlyDownloading: Record<string, DownloadingState | null>;
	downloadedEpisodes: Record<number, number[]>;
	static DOWNLOADED_EPISODES_DIR =
		`${FileSystem.documentDirectory}downloadedEpisodes/`;
	static PROGRESS_NOTIFICATION_CHANNEL_ID = "downloads";
	static FINISHED_DOWNLOADING_NOTIFICATION_CHANNEL_ID = "downloaded";

	constructor() {
		this.currentlyDownloading = {};
		this.downloadedEpisodes = {};

		notifee
			.getChannel(Downloader.PROGRESS_NOTIFICATION_CHANNEL_ID)
			.then((c) => {
				if (!c) {
					notifee.createChannel({
						id: Downloader.PROGRESS_NOTIFICATION_CHANNEL_ID,
						name: "Downloading Episodes Status",
						description:
							"Progress bar notification for episode dowloading status",
						vibration: false,
						importance: AndroidImportance.LOW,
						badge: false,
					});
				}
			});

		notifee
			.getChannel(Downloader.FINISHED_DOWNLOADING_NOTIFICATION_CHANNEL_ID)
			.then((c) => {
				if (!c) {
					notifee.createChannel({
						id: Downloader.FINISHED_DOWNLOADING_NOTIFICATION_CHANNEL_ID,
						name: "Finished Downloading episode",
						description:
							"Notification when an episode has finished downloading",
						vibration: true,
						importance: AndroidImportance.DEFAULT,
						badge: false,
					});
				}
			});

		this.readFromFs();
	}

	onEvent(e: NotificationEvent) {
		if (
			e.detail.notification?.android?.channelId ===
			Downloader.PROGRESS_NOTIFICATION_CHANNEL_ID
		) {
			if (
				e.detail.notification?.id &&
				e.detail.pressAction?.id &&
				e.detail.notification.data &&
				"mediaId" in e.detail.notification.data &&
				"episode" in e.detail.notification.data
			) {
				const { mediaId, episode } = e.detail.notification.data as {
					mediaId: number;
					episode: Episode;
				};

				switch (e.detail.pressAction.id) {
					case "cancel":
						this.cancelDownload(mediaId, episode.id);
						break;

					case "pause":
						this.pauseDownload(mediaId, episode.id);
						break;

					case "resume":
						this.resumeDownload(mediaId, episode.id);
						break;

					default:
						break;
				}
			}
		}
	}

	async readFromFs() {
		try {
			const dir = (
				await FileSystem.readDirectoryAsync(Downloader.DOWNLOADED_EPISODES_DIR)
			).map((e) => Number.parseInt(e));

			for (const mediaId of dir) {
				const episodes = await FileSystem.readDirectoryAsync(
					Downloader.DOWNLOADED_EPISODES_DIR + mediaId,
				);
				this.downloadedEpisodes[mediaId] = episodes.map((e) =>
					Number.parseInt(e),
				);
			}
		} catch (_error) {
			FileSystem.makeDirectoryAsync(Downloader.DOWNLOADED_EPISODES_DIR, {
				intermediates: true,
			});
			this.downloadedEpisodes = {};
		}
	}

	async startDownload(media: Media, episode: Episode) {
		if (!media.id) {
			return null;
		}

		const [uriPromise, headers] = getVideoUri(episode.url);
		const uri = await uriPromise;

		const formatedFileName = Downloader.formatFileName(media.id, episode.id);

		await FileSystem.makeDirectoryAsync(
			Downloader.DOWNLOADED_EPISODES_DIR + media.id,
			{ intermediates: true },
		);

		const notificationData: Notification = {
			id: Downloader.notificationId(formatedFileName),
			title: "Downloading",
			subtitle: `${media.title?.english} ep. ${episode.name}`,
			body: `${media.title?.english} ep. ${episode.name}`,
			android: {
				ongoing: true,
				onlyAlertOnce: true,
				smallIcon: "notification_icon",
				channelId: Downloader.PROGRESS_NOTIFICATION_CHANNEL_ID,
				progress: {
					current: 0,
					max: 1,
				},
				colorized: true,
				color: Colors.dark.accent,
				groupId: media.id.toString(),
			},
			data: {
				mediaId: media.id,
				episode,
			},
		};

		const downloadResumable = FileSystem.createDownloadResumable(
			uri,
			Downloader.DOWNLOADED_EPISODES_DIR + formatedFileName,
			{ headers },
			(data: FileSystem.DownloadProgressData) =>
				this.callback(media.id as number, episode.id, data),
		);

		this.currentlyDownloading[formatedFileName] = {
			url: uri,
			progressData: {
				totalBytesExpectedToWrite: 1,
				totalBytesWritten: 0,
			},
			paused: false,
			downloadResumable,
			callback: undefined,
			notificationData,
			updateTimer: null,
		};

		await notifee.displayNotification(notificationData);

		(async () => {
			try {
				if (await downloadResumable.downloadAsync()) {
					this.pushNewDownloadedEpisode(media.id as number, episode.id);
				}
			} catch (e) {
				console.error(e);
			}
		})();
	}

	getDownloadingState(
		mediaId: number,
		episodeId: EpisodeId,
		attachOnProgressCallback?: DownloadingProgressUpdateCallback | null,
	) {
		const state =
			this.currentlyDownloading[Downloader.formatFileName(mediaId, episodeId)];
		if (state && attachOnProgressCallback !== undefined) {
			state.callback = attachOnProgressCallback ?? undefined;
		}
		return state;
	}

	async pauseDownload(mediaId: number, episodeId: EpisodeId) {
		const downloadingState = this.getDownloadingState(mediaId, episodeId);
		if (downloadingState) {
			downloadingState.paused = true;
			this.callback(mediaId, episodeId, downloadingState.progressData);
			try {
				await downloadingState?.downloadResumable.pauseAsync();
				console.log("Paused download operation, saving for future retrieval");
				// TODO: RESUME LATER
				// AsyncStorage.setItem(
				// 	"pausedDownload",
				// 	JSON.stringify(downloadResumable.savable()),
				// );
			} catch (e) {
				console.error(e);
			}
		}
	}

	async resumeDownload(mediaId: number, episodeId: EpisodeId) {
		const downloadingState = this.getDownloadingState(mediaId, episodeId);
		if (downloadingState) {
			downloadingState.paused = false;
			this.callback(mediaId, episodeId, downloadingState.progressData);
			try {
				if (await downloadingState.downloadResumable.resumeAsync()) {
					this.pushNewDownloadedEpisode(mediaId, episodeId);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	private pushNewDownloadedEpisode(mediaId: number, episodeId: EpisodeId) {
		const formatedFileName = Downloader.formatFileName(mediaId, episodeId);

		notifee.cancelDisplayedNotification(
			Downloader.notificationId(formatedFileName),
		);

		if (!this.downloadedEpisodes[mediaId]) {
			this.downloadedEpisodes[mediaId] = [];
		}
		this.downloadedEpisodes[mediaId].push(episodeId);

		const downloadState = this.currentlyDownloading[formatedFileName];

		if (downloadState?.callback) {
			downloadState.callback(null);
		}

		notifee.displayNotification({
			title: "✅ Finished downloading episode",
			subtitle: downloadState?.notificationData.subtitle,
			body: downloadState?.notificationData.body,
			android: {
				smallIcon: "notification_icon",
				channelId: Downloader.FINISHED_DOWNLOADING_NOTIFICATION_CHANNEL_ID,
			},
		});

		delete this.currentlyDownloading[formatedFileName];
	}

	async deleteDownloadedEpisode(mediaId: number, episodeId: EpisodeId) {
		try {
			await FileSystem.deleteAsync(
				Downloader.DOWNLOADED_EPISODES_DIR +
					Downloader.formatFileName(mediaId, episodeId),
			);
			const index = this.downloadedEpisodes[mediaId]?.findIndex(
				(ep) => ep === episodeId,
			);
			if (index) {
				this.downloadedEpisodes[mediaId].splice(index, 1);
			}
			if (!this.downloadedEpisodes[mediaId].length) {
				delete this.downloadedEpisodes[mediaId];
			}
		} catch (error) {
			console.error("Error Occured While Deleting");
		}
	}

	async cancelDownload(mediaId: number, episodeId: EpisodeId) {
		const formatedFileName = Downloader.formatFileName(mediaId, episodeId);
		const downloadingState = this.currentlyDownloading[formatedFileName];
		delete this.currentlyDownloading[formatedFileName];
		await downloadingState?.downloadResumable.cancelAsync();
		if (downloadingState?.callback) {
			downloadingState?.callback(null);
		}
		notifee.cancelDisplayedNotification(
			Downloader.notificationId(formatedFileName),
		);
	}

	static formatFileName(mediaId: number, episodeId: EpisodeId) {
		return `${mediaId}/${episodeId}`;
	}

	static notificationId(formatedFileName: string) {
		return `downloading_${formatedFileName}`;
	}

	async getDownloadedEpisodeFileUri(mediaId: number, episodeId: EpisodeId) {
		return await FileSystem.getContentUriAsync(
			Downloader.DOWNLOADED_EPISODES_DIR +
				Downloader.formatFileName(mediaId, episodeId),
		);
	}

	private callback(
		mediaId: number,
		episodeId: EpisodeId,
		data: FileSystem.DownloadProgressData,
	) {
		const downloadingState = this.getDownloadingState(mediaId, episodeId);
		if (downloadingState) {
			downloadingState.progressData = data;

			if (!downloadingState.updateTimer) {
				const percentProgress = Math.round(
					(downloadingState.progressData.totalBytesWritten /
						downloadingState.progressData.totalBytesExpectedToWrite) *
						100,
				);

				notifee.displayNotification({
					...downloadingState.notificationData,
					body: `${downloadingState.notificationData.body} - ${percentProgress}%`,
					android: {
						...downloadingState.notificationData.android,
						progress: {
							current: downloadingState.progressData.totalBytesWritten,
							max: downloadingState.progressData.totalBytesExpectedToWrite,
						},
						actions: [
							{
								title: downloadingState.paused ? "Resume" : "Pause",
								pressAction: {
									id: downloadingState.paused ? "resume" : "pause",
								},
							},
							{ title: "Cancel", pressAction: { id: "cancel" } },
						],
					},
				});
				downloadingState.updateTimer = setTimeout(() => {
					downloadingState.updateTimer = null;
				}, 500);
			}

			if (downloadingState.callback) {
				downloadingState.callback(downloadingState);
			}
		}
	}
}

export interface DownloadingState {
	downloadResumable: FileSystem.DownloadResumable;
	url: URL | string;
	progressData: FileSystem.DownloadProgressData;
	paused: boolean;
	callback?: DownloadingProgressUpdateCallback;
	notificationData: Notification;
	updateTimer: NodeJS.Timeout | null;
}

export const DownloadingContext = createContext<Downloader>(
	undefined as unknown as Downloader,
);

interface Props {
	children: ReactNode;
	downloader: Downloader;
}

export default function DownloadingProvider({ children, downloader }: Props) {
	return (
		<DownloadingContext.Provider value={downloader}>
			{children}
		</DownloadingContext.Provider>
	);
}

export type DownloadingProgressUpdateCallback = (
	state: DownloadingState | null,
) => void;
