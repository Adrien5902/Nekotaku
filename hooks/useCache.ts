import * as FileSystem from 'expo-file-system';
import type { AnimeSamaMediaType, AnimeSamaUrl, Episode, EpisodeId, Lang, LangsAndEpisodes, Lecteur } from "@/types/AnimeSama"
import type { AnimeSamaSearch, AnimeSamaSearchMediaType } from "./useAnimeSamaSearch"
import type { Media, MediaQuery } from "@/types/Anilist/graphql"
import type { AniskipData } from "./useAniskip"
import { useEffect, useRef, useState } from 'react';

export class CCache {
    private map = new Map<CacheKey, CacheValues<CacheKey>>();
    private listeners: ({ key: CacheKey, fn: () => void })[] = []

    async readAllDisk<T extends CacheKey>(key: T) {
        if (!FileSystem.cacheDirectory) { throw new Error("No cache dir") }

        let jsonStr: string | undefined = undefined;
        try {
            jsonStr = await FileSystem.readAsStringAsync(FileSystem.cacheDirectory + key)
            const cache: Record<string, CacheValue<T>> = JSON.parse(jsonStr)
            return cache
        } catch (error) {
            return null
        }
    }

    async readAllMem<T extends CacheKey>(key: T) {
        return this.map.get(key) as CacheValues<T> | undefined ?? null
    }

    async readAll<T extends CacheKey>(readType: CacheReadType, key: T) {
        // We read from memory before reading from disk
        const fromMemory = (readType & CacheReadType.Memory) ? await this.readAllMem(key) : null;
        if (fromMemory) return fromMemory;

        const fromDisk = (readType & CacheReadType.Disk) ? await this.readAllDisk(key) : null;
        // If there was no data in memory but some was found on disk write it to memory (if readType is set to both)
        if (readType & CacheReadType.MemoryAndIfNotDisk && fromDisk) { this.writeAll(CacheReadType.Memory, key, fromDisk) }
        return fromDisk;
    }

    async read<T extends CacheKey>(readType: CacheReadType, key: T, deps: CacheDeps<T>) {
        return (await this.readAll(readType, key))?.[JSON.stringify(deps)] ?? null
    }

    useAll<T extends CacheKey>(readType: CacheReadType, key: T) {
        const dataRef = useRef<CacheValues<T> | null>();
        const [loading, setLoading] = useState<boolean>(true);

        const refresh = async () => {
            setLoading(true)
            dataRef.current = await this.readAll(readType, key)
            setLoading(false)
        }

        useEffect(() => {
            refresh()
            const length = this.listeners.push({ key, fn: refresh });
            const index = length - 1;

            return () => {
                delete this.listeners[index];
            }
        }, [])

        return { loading, data: dataRef.current, refresh };
    }

    use<T extends CacheKey>(readType: CacheReadType, key: T, deps: CacheDeps<T>) {
        const dataRef = useRef<CacheValue<T> | null>();
        const [loading, setLoading] = useState<boolean>(true);

        const refresh = async () => {
            setLoading(true)
            dataRef.current = await this.read(readType, key, deps)
            setLoading(false)
        }

        useEffect(() => {
            refresh();
            const length = this.listeners.push({ key, fn: refresh });
            const index = length - 1;

            return () => {
                delete this.listeners[index];
            }
        }, [])

        return { loading, data: dataRef.current, refresh };
    }

    sendEvent<T extends CacheKey>(key: T) {
        for (const listener of this.listeners) {
            if (listener && listener.key === key) listener.fn()
        }
    }

    async writeAll<T extends CacheKey>(readType: CacheReadType, key: T, data: CacheValues<T>, sendEvent?: boolean) {
        if (readType & CacheReadType.Disk) {
            if (!FileSystem.cacheDirectory) { throw new Error("No cache dir") }
            FileSystem.writeAsStringAsync(FileSystem.cacheDirectory + key, JSON.stringify(data))
        }

        if (readType & CacheReadType.Memory) {
            this.map.set(key, data)
        }

        if (sendEvent) this.sendEvent(key)
    }

    async write<T extends CacheKey>(readType: CacheReadType, key: T, deps: CacheDeps<T>, data: CacheValue<T>, sendEvent?: boolean) {
        const valKey = JSON.stringify(deps);
        if (readType & CacheReadType.Disk) {
            if (!FileSystem.cacheDirectory) { throw new Error("No cache dir") }
            const record = await this.readAll(readType, key) ?? {};
            record[valKey] = data
            this.writeAll(CacheReadType.Disk, key, record)
        }

        if (readType & CacheReadType.Memory) {
            const record = await this.readAll(CacheReadType.Memory, key) ?? {}
            record[valKey] = data
            this.writeAll(CacheReadType.Memory, key, record, sendEvent)
        }
    }
}


export type CacheKey = keyof CacheKeys
export type CacheValue<T extends CacheKey> = CacheKeys[T]["data"]
export type CacheDeps<T extends CacheKey> = CacheKeys[T]["deps"]
export type CacheValues<T extends CacheKey> = Record<string, CacheValue<T>>

export interface CacheKeys {
    episodeProgress: { data: { positionMillis: number, durationMillis?: number }, deps: [Media["id"], EpisodeId] }
    langsAndEpisodes: { data: LangsAndEpisodes, deps: [AnimeSamaSearch<unknown> | undefined] }
    animeSamaSearch: { data: AnimeSamaSearch<unknown>, deps: [AnimeSamaSearchMediaType] }
    animeSamaLecteurs: { data: Lecteur[], deps: [keyof typeof Lang | null, string | undefined, number | undefined, boolean | undefined, AnimeSamaMediaType | undefined] }
    media: { data: MediaQuery["Media"], deps: [Media["id"]] }
    aniskip: { data: AniskipData["results"] | null, deps: [Media["id"], EpisodeId, number | undefined] }
    videoUri: { data: string, deps: [Media["id"], Episode["url"]] }
}

export enum CacheReadType {
    Memory = 1 << 0, // 01
    Disk = 1 << 1, // 10
    MemoryAndIfNotDisk = Memory | Disk // 11
}

const Cache = new CCache()
export default Cache