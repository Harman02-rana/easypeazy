"use client";

import { useEffect, useRef, useState } from "react";
import { useApplications } from "./useTracker";
import { useLocalStorage } from "./useLocalStorage";
import { TRACKER_KEYS } from "@/lib/storage";
import { computeMilestoneUpdate, INITIAL_MILESTONE_STATE } from "@/lib/milestoneLogic";
import type { Celebration } from "@/lib/milestoneLogic";

export function useApplicationMilestones() {
  const { items: applications, hydrated: appsHydrated } = useApplications();
  const [state, setState, stateHydrated] = useLocalStorage(
    TRACKER_KEYS.applicationMilestoneState,
    INITIAL_MILESTONE_STATE
  );
  const [queue, setQueue] = useState<Celebration[]>([]);

  // Read the latest state without putting it in the effect's dependency
  // array — we only want this to run when the applications actually
  // change, not every time we write the state back.
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!appsHydrated || !stateHydrated) return;

    const { celebrations, nextState } = computeMilestoneUpdate(
      applications,
      stateRef.current
    );

    if (nextState !== stateRef.current) {
      setState(nextState);
    }
    if (celebrations.length > 0) {
      setQueue((q) => [...q, ...celebrations]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, appsHydrated, stateHydrated]);

  function dismissCurrent() {
    setQueue((q) => q.slice(1));
  }

  return { current: queue[0] ?? null, dismissCurrent };
}
