// The bright, warm light theme is the intended default experience — unlike
// a typical app, we don't fall back to the OS's dark-mode preference. Once
// someone explicitly picks a theme (via the toggle), that choice sticks.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var isDark = stored === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
