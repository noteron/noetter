import { useCallback, useEffect, useState } from "react";

const useLocalStorageState = <T>(
  localStorageKey: string,
  initialState: T
): [T | undefined, (newValue: T | undefined) => void] => {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [initialSetupNeeded, setInitialSetupNeeded] = useState<boolean>(true);

  const getFromLocalStorage = useCallback((): T | undefined => {
    const raw = localStorage.getItem(localStorageKey) ?? undefined;
    if (raw === undefined || raw === "undefined") return undefined;
    const t: T = JSON.parse(raw);
    return t;
  }, [localStorageKey]);

  const setLocalStorage = useCallback(
    (newState: T | undefined) =>
      localStorage.setItem(localStorageKey, JSON.stringify(newState)),
    [localStorageKey]
  );

  const useInitialValue = useCallback((): void => {
    if (!initialSetupNeeded) return;
    const storedValue = getFromLocalStorage();
    if (storedValue) {
      setValue(storedValue);
    } else {
      setValue(initialState);
      setLocalStorage(initialState);
    }
    setInitialSetupNeeded(false);
  }, [getFromLocalStorage, initialSetupNeeded, initialState, setLocalStorage]);

  useEffect(useInitialValue, [useInitialValue]);

  const handleSetValue = useCallback(
    (newValue: T | undefined) => {
      setLocalStorage(newValue);
      setValue(newValue);
    },
    [setLocalStorage]
  );

  return [value, handleSetValue];
};

export default useLocalStorageState;
