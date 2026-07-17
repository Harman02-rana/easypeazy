export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Easypeazyy. Built for the Class of 2027.</p>
        <p className="text-xs">
          Data sourced from official company career pages. Always verify details before applying.
        </p>
      </div>
    </footer>
  );
}
