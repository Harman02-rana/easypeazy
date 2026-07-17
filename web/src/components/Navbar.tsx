import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-accent to-accent-2 text-white text-sm font-bold">
            E
          </span>
          Easypeazyy
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
          <Link href="/#companies" className="transition-colors hover:text-foreground">
            Companies
          </Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#companies"
            className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:block"
          >
            Browse companies
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
