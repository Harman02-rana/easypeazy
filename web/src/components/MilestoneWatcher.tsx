"use client";

import { useApplicationMilestones } from "@/hooks/useApplicationMilestones";
import MilestoneCelebration from "./MilestoneCelebration";

export default function MilestoneWatcher() {
  const { current, dismissCurrent } = useApplicationMilestones();

  if (!current) return null;

  return (
    <MilestoneCelebration
      key={current.id}
      celebration={current}
      onClose={dismissCurrent}
    />
  );
}
