"use client";

import { useCallback, useEffect, useState } from "react";
import { store } from "@/lib/storage";

/**
 * Generic persisted-list hook. Renders with `initialValue` on both server
 * and first client paint (so there's nothing for React to mismatch), then
 * loads the real value from storage in an effect — the standard pattern
 * for reading browser-only storage in Next.js without hydration errors.
 *
 * `hydrated` is false until that load has happened; components that need
 * to distinguish "genuinely empty" from "haven't checked storage yet"
 * should gate on it (e.g. to avoid flashing an empty state for a moment).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

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

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        store.setItem(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}
