"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { publishKeyChange, store, subscribeToKey } from "@/lib/storage";

/**
 * Generic persisted-list hook. Renders with `initialValue` on both server
 * and first client paint (so there's nothing for React to mismatch), then
 * loads the real value from storage in an effect — the standard pattern
 * for reading browser-only storage in Next.js without hydration errors.
 *
 * `hydrated` is false until that load has happened; components that need
 * to distinguish "genuinely empty" from "haven't checked storage yet"
 * should gate on it (e.g. to avoid flashing an empty state for a moment).
 *
 * Multiple components can call this for the same key at the same time
 * (e.g. the Applications page and the globally-mounted milestone watcher
 * both read `jhp_applications`) — writes from any one instance are
 * published so every other instance re-reads and stays in sync.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Mirrors `value` synchronously so `update` can resolve a functional
  // updater's `prev` without putting side effects (store writes, publishing
  // to other instances) inside the `setValue` updater itself — React may
  // invoke that updater outside of the normal event-handler timing, which
  // is unsafe for anything that isn't a pure state computation.
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const stored = store.getItem<T>(key);
    if (stored !== null) {
      setValue(stored);
    } else {
      // First-ever visit for this key: persist the seed/starter value so
      // it becomes the real record going forward (edits and deletions —
      // including emptying the list entirely — stick on reload instead of
      // reverting to the default every time).
      store.setItem(key, initialValue);
    }
    setHydrated(true);
    // Only run on mount / key change — reading storage on every render
    // would defeat the point of holding it in state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    return subscribeToKey(key, () => {
      const stored = store.getItem<T>(key);
      if (stored !== null) setValue(stored);
    });
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(valueRef.current)
          : next;
      valueRef.current = resolved;
      store.setItem(key, resolved);
      publishKeyChange(key);
      setValue(resolved);
    },
    [key]
  );

  return [value, update, hydrated] as const;
}
