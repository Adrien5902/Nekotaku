import { useEffect, useMemo, useRef, useState } from "react"

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
        fn().then((res) => {
            if (res !== undefined) {
                dataRef.current = res
                setLoading(false)
            }
        }).catch((err) => {
            errorRef.current = err
            setLoading(false)
        })

        return onUnmounted
    }, deps ?? [])

    return { loading, data: dataRef.current, error: errorRef.current }
}

export interface UseCachedPromise<R> extends UsePromise<R> {
    refresh: () => Promise<boolean>
}

export const cache = new Map<string, unknown>();

export function useMemoryCachedPromise<R>(
    key: string,
    fn: () => Promise<R | undefined>,
    deps?: unknown[],
    onUnmounted?: () => void
): UseCachedPromise<R> {
    const dataRef = useRef<R>();
    const [loading, setLoading] = useState<boolean>(true);
    const errorRef = useRef<Error>();

    const cacheKey = key + deps ? JSON.stringify(deps) : "default";

    function refresh() {
        return new Promise<boolean>((resolve, reject) => {
            dataRef.current = undefined
            setLoading(true);
            fn()
                .then((res) => {
                    if (res !== undefined) {
                        dataRef.current = res;
                        cache.set(cacheKey, res);
                        setLoading(false);
                        resolve(true)
                    }
                })
                .catch((err) => {
                    errorRef.current = err;
                    setLoading(false);
                    resolve(false)
                });
        })
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (cache.has(cacheKey)) {
            dataRef.current = cache.get(cacheKey) as R;
            setLoading(false);
            return onUnmounted;
        }

        refresh()

        return onUnmounted;
    }, deps ?? []);

    return { loading, data: dataRef.current, error: errorRef.current, refresh };
}