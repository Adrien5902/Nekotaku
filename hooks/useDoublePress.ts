import { useRef } from "react";

export function useDoublePress<T>(onSingle: (e: T) => void, onDouble?: (e: T) => void, timeout = 500, waitTimeoutForSingle?: boolean) {
    const timer = useRef<NodeJS.Timeout | null>(null);

    if (onDouble) {
        return (e: T) => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
                onDouble(e);
            } else {
                timer.current = setTimeout(() => {
                    if (waitTimeoutForSingle) onSingle(e);
                    timer.current = null;
                }, timeout);
            }

            if (!waitTimeoutForSingle) onSingle(e);
        };
    }

    return (e: T) => onSingle(e);
}