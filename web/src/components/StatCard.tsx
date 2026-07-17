import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  text: string;
  bg: string;
  href?: string;
  hint?: string;
}

export default function StatCard({ icon: Icon, label, value, text, bg, href, hint }: StatCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: bg, color: text }}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        {hint && (
          <span className="text-[11px] font-medium text-muted">{hint}</span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="card-soft block p-4">
        {content}
      </Link>
    );
  }

  return <div className="card-soft p-4">{content}</div>;
}
