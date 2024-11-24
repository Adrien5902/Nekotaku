import * as FileSystem from 'expo-file-system';
import { cache, type UseCachedPromise, usePromise } from './usePromise';
import { useEffect, useRef, useState } from 'react';

async function readCache<T>(key: string) {
    let jsonStr: string | undefined = undefined;
    try {
        jsonStr = await FileSystem.readAsStringAsync(FileSystem.cacheDirectory + key)
        const cache: Record<string, T> = JSON.parse(jsonStr)
        return cache
    } catch (error) {
        return null
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

function useWithMemory<R>(key: string, fn: () => Promise<R | undefined>, deps: unknown[]): UseCachedPromise<R> {
    const dataRef = useRef<R>();
    const [loading, setLoading] = useState<boolean>(true);
    const errorRef = useRef<Error>();

    const cacheKey = key + deps ? JSON.stringify(deps) : "default";

    function refresh() {
        return new Promise<boolean>((resolve) => {
            dataRef.current = undefined
            setLoading(true);
            fn()
                .then((res) => {
                    if (res !== undefined) {
                        dataRef.current = res;
                        cache.set(cacheKey, res);
                        DiskCache.write(key, deps, res)
                        setLoading(false);
                        resolve(true)
                    }
                })
                .catch((_err) => {
                    resolve(false)
                });
        })
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (cache.has(cacheKey)) {
            dataRef.current = cache.get(cacheKey) as R;
            setLoading(false);
        } else {
            refresh().then((ok) => {
                if (!ok) {
                    DiskCache.read<R>(key, deps).then((data) => {
                        if (data) {
                            dataRef.current = data;
                            cache.set(cacheKey, data);
                            setLoading(false);
                        }
                    })
                }
            })
        }
    }, deps ?? []);

    return { loading, data: dataRef.current, error: errorRef.current, refresh };
}

const DiskCache = {
    write,
    read,
    use,
    readAll,
    useAll,
    useWithMemory,
}

export default DiskCache
