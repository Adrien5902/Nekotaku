import { useEffect, useRef, useState } from "react"
import Cache from "./useCache";
import type { CacheDeps, CacheKey, CacheReadType, CacheValue } from "./useCache";

export interface UsePromise<R> {
    loading: boolean,
    data?: R,
    error?: Error
}

/**
 * @param fn async function
 * @param deps Array of dependencies, if not specified changes every first render
 * @returns 
*/
export function usePromise<R>(fn: () => Promise<R | undefined>, deps?: unknown[], onUnmounted?: () => void): UsePromise<R> {
    const dataRef = useRef<R>();
    const [loading, setLoading] = useState<boolean>(true)
    const errorRef = useRef<Error>()

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setLoading(true)
        errorRef.current = undefined
        try {
            fn().then((res) => {
                if (res !== undefined) {
                    dataRef.current = res
                    setLoading(false)
                }
            }).catch((error) => {
                errorRef.current = error
                setLoading(false)
            })
        } catch (error) {
            errorRef.current = error as Error
            setLoading(false)
        }

        return onUnmounted
    }, deps ?? [])

    return { loading, data: dataRef.current, error: errorRef.current }
}

export function useCachedPromise<T extends CacheKey>(readType: CacheReadType, key: T, fn: () => Promise<CacheValue<T> | undefined>, deps: CacheDeps<T>, onUnmounted?: () => void): UseCachedPromise<CacheValue<T>> {
    const dataRef = useRef<CacheValue<T>>();
    const [loading, setLoading] = useState<boolean>(true)
    const errorRef = useRef<Error>()

    const fetchData = async () => {
        try {
            const res = await fn()
            if (res !== undefined) {
                dataRef.current = res
                Cache.write(readType, key, deps, res, false)
                setLoading(false)
            }
            return true
        } catch (error) {
            errorRef.current = error as Error
            setLoading(false)
            return false
        }
    }

    function refresh() {
        setLoading(true)
        return fetchData()
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        (async () => {
            setLoading(true)
            errorRef.current = undefined

            const cacheHit = await Cache.read(readType, key, deps) ?? undefined
            if (cacheHit) {
                dataRef.current = cacheHit
                setLoading(false)
            }

            await fetchData()
        })()

        return onUnmounted
    }, deps ?? [])

    return { loading, data: dataRef.current, error: errorRef.current, refresh }
}

export interface UseCachedPromise<R> extends UsePromise<R> {
    refresh: () => Promise<boolean>
}
