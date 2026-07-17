import type { ApplicationStatus } from "./trackerTypes";

/** Display label + color for each application status. The internal status
 * value is always the real word (e.g. "Rejected") — only the label shown
 * to Aditya is softened, so "Didn't Work Out" is presentational only and
 * never stored or compared against. */
export function statusLabel(status: ApplicationStatus): string {
  if (status === "Rejected") return "Didn't Work Out";
  return status;
}

export function statusColors(status: ApplicationStatus): { text: string; bg: string } {
  switch (status) {
    case "Applied":
      return { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" };
    case "OA":
      return { text: "var(--cat-study)", bg: "var(--cat-study-bg)" };
    case "Interview":
      return { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" };
    case "Offer":
      return { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" };
    case "Rejected":
      return { text: "var(--cat-rejected)", bg: "var(--cat-rejected-bg)" };
    case "Withdrawn":
      return { text: "var(--muted)", bg: "var(--surface-hover)" };
    case "Saved":
    default:
      return { text: "var(--muted)", bg: "var(--surface-hover)" };
  }
}
