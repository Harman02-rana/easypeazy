import type { LucideIcon } from "lucide-react";

export default function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  tint = "var(--accent)",
  tintBg = "var(--accent-soft-bg)",
  actions,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  tint?: string;
  tintBg?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        {(Icon || eyebrow) && (
          <div className="mb-2 flex items-center gap-2">
            {Icon && (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: tintBg, color: tint }}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
            )}
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {eyebrow}
              </span>
            )}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[26px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
