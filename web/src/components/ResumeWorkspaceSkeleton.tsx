/** Shown only during the brief client-side hydration window (reading
 * localStorage) — replaces a jarring blank flash with a shape that matches
 * what's about to render, so the page doesn't visibly "jump" once data
 * loads. */
export default function ResumeWorkspaceSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="card-soft h-40 p-4">
        <div className="h-4 w-1/3 rounded bg-surface-hover" />
        <div className="mt-4 h-24 rounded bg-surface-hover" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-soft h-36 p-4">
            <div className="h-4 w-2/3 rounded bg-surface-hover" />
            <div className="mt-3 h-3 w-1/2 rounded bg-surface-hover" />
            <div className="mt-4 h-7 w-full rounded bg-surface-hover" />
          </div>
        ))}
      </div>
    </div>
  );
}
