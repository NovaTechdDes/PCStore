import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 350): T => {
    const [debounceValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer)
    }, [value, delay]);

    return debounceValue;
}