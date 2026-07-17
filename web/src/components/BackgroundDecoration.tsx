/** Very soft, blurred pastel shapes behind the page content. Purely
 * decorative, fixed position, low opacity — meant to be felt more than
 * seen. Never interferes with reading or interaction. */
export default function BackgroundDecoration() {
  return (
    <div className="bg-decoration" aria-hidden>
      <span
        style={{
          top: "-8%",
          left: "-6%",
          width: 340,
          height: 340,
          background: "var(--cat-study)",
        }}
      />
      <span
        style={{
          top: "8%",
          right: "-10%",
          width: 300,
          height: 300,
          background: "var(--cat-interview)",
        }}
      />
      <span
        style={{
          bottom: "-10%",
          left: "18%",
          width: 380,
          height: 380,
          background: "var(--cat-offer)",
        }}
      />
    </div>
  );
}
