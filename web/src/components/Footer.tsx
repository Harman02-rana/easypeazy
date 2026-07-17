import { SITE_NAME } from "@/lib/personalConfig";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-xs text-muted sm:flex-row">
        <p>{SITE_NAME} — built for the 2027 placement season.</p>
        <p>Always verify details on the official careers page before applying.</p>
      </div>
    </footer>
  );
}
