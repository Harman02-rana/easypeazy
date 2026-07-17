"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { todaysGoal } from "@/lib/dailyGoalConfig";

export default function TodayGoal({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [goal, setGoal] = useState<string | null>(null);

  useEffect(() => {
    setGoal(todaysGoal());
  }, []);

  if (!goal) return null;

  return (
    <span className={`flex items-center gap-1 ${className}`} style={style}>
      <Target className="h-3 w-3 shrink-0" strokeWidth={2} />
      {goal}
    </span>
  );
}
