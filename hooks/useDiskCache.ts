import * as FileSystem from 'expo-file-system';
import { usePromise } from './usePromise';

function use<T>(key: string, deps: unknown[]) {
    return usePromise(() => read<T>(key, deps), [])
}

async function read<T>(key: string, deps: unknown[]) {
    let jsonStr: string | undefined = undefined;
    try {
        jsonStr = await FileSystem.readAsStringAsync(FileSystem.cacheDirectory + key)
        const cache: Record<string, T> = JSON.parse(jsonStr)
        const data = cache[JSON.stringify(deps)]
        return data ?? null
    } catch (error) {
        return null
    }
}

async function write<T>(key: string, deps: unknown[], data: T) {
    let jsonStr: string | undefined = undefined;
    try {
        jsonStr = await FileSystem.readAsStringAsync(FileSystem.cacheDirectory + key)
    } catch (error) { }

    const cache: Record<string, unknown> = jsonStr ? JSON.parse(jsonStr) : {}
    cache[JSON.stringify(deps)] = data
    await FileSystem.writeAsStringAsync(FileSystem.cacheDirectory + key, JSON.stringify(cache))
}

const DiskCache = {
    write,
    read,
    use
}
export default DiskCache
