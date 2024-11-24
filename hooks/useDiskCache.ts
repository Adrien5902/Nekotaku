import * as FileSystem from 'expo-file-system';
import { usePromise } from './usePromise';

async function readCache<T>(key: string) {
    let jsonStr: string | undefined = undefined;
    try {
        jsonStr = await FileSystem.readAsStringAsync(FileSystem.cacheDirectory + key)
        const cache: Record<string, T> = JSON.parse(jsonStr)
        return cache
    } catch (error) {
        return undefined
    }
}

function use<T>(key: string, deps: unknown[]) {
    return usePromise(() => read<T>(key, deps), deps)
}

function useAll<T>(key: string, deps?: unknown[]) {
    return usePromise(() => readAll<T>(key), deps ?? [])
}

async function readAll<T>(key: string) {
    const cache = await readCache<T>(key)
    if (!cache) {
        return null
    }

    return Object.values(cache)
}

async function read<T>(key: string, deps: unknown[]) {
    const cache = await readCache<T>(key)
    const data = cache?.[JSON.stringify(deps)] as T | undefined
    return data ?? null
}

async function write<T>(key: string, deps: unknown[], data: T) {
    const cache = await readCache<T>(key) ?? {}

    cache[JSON.stringify(deps)] = data
    await FileSystem.writeAsStringAsync(FileSystem.cacheDirectory + key, JSON.stringify(cache))
}

const DiskCache = {
    write,
    read,
    use,
    readAll,
    useAll
}

export default DiskCache
