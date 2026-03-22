import { useCallback, useEffect, useState } from 'react';
import { getCachedValue, setCachedValue } from '@/utils/indexedDbCache';

export function usePersistedSetting<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = await getCachedValue<T>(key);
      if (!cancelled && cached) {
        setValue(cached.value);
      }
      if (!cancelled) {
        setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key]);

  const updateValue = useCallback(
    (next: T) => {
      setValue(next);
      void setCachedValue(key, next);
    },
    [key],
  );

  return {
    value,
    loaded,
    setValue: updateValue,
  };
}
