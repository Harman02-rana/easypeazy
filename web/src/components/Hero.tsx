import Link from "next/link";

export default function Hero({
  companyCount,
  roleCount,
}: {
  companyCount: number;
  roleCount: number;
}) {
  return (
    <section className="hero-glow bg-grid relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-28 text-center sm:py-36">
        <div className="animate-fade-in-up mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Built for the Class of 2027
        </div>

        <h1
          className="animate-fade-in-up mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl"
          style={{ animationDelay: "0.05s" }}
        >
          Your next internship,{" "}
          <span className="text-gradient">already verified.</span>
        </h1>

        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-xl text-balance text-base text-muted sm:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          {companyCount}+ companies, {roleCount}+ open internship and new-grad
          software roles — every link traced back to the company&rsquo;s own
          careers page. No job-board noise.
        </p>

        <div
          className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.15s" }}
        >
          <Link
            href="#companies"
            className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85 sm:w-auto"
          >
            Browse companies
          </Link>
          <Link
            href="#how-it-works"
            className="w-full rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-border-strong hover:bg-surface-hover sm:w-auto"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
