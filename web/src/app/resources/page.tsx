import type { Metadata } from "next";
import ResourceCard from "@/components/ResourceCard";
import { getResources, getResourceCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resources — JobHunter Pro",
};

function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ResourcesPage() {
  const resources = getResources();
  const categories = getResourceCategories();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Places to check regularly
      </h1>
      <p className="mt-1 text-sm text-muted">
        External job-search resources worth bookmarking, grouped by type.
      </p>

      <div className="mt-8 space-y-10">
        {categories.map((category) => (
          <section key={category} id={slugify(category)}>
            <h2 className="text-base font-semibold tracking-tight">
              {category}
            </h2>
            <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface">
              {resources
                .filter((r) => r.category === category)
                .map((resource) => (
                  <ResourceCard key={resource.name} resource={resource} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
