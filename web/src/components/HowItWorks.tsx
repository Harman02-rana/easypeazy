const steps = [
  {
    title: "Search & filter",
    description:
      "Find companies by name or narrow down by category — Big Tech, FinTech, Semiconductor, and more.",
  },
  {
    title: "Go straight to the source",
    description:
      "Every card links directly to the company's own careers, internship, and new-grad pages — never a third-party board.",
  },
  {
    title: "Apply with confidence",
    description:
      "See open role counts and hiring season at a glance, then apply on the company's official site.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-border bg-background p-6">
              <span className="text-xs font-semibold text-accent">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
