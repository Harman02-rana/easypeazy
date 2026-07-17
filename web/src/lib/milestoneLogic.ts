import { computeApplicationStats } from "./applicationUtils";
import {
  FIRST_APPLICATION_MESSAGE,
  FIRST_INTERVIEW_MESSAGE,
  FIRST_OA_MESSAGE,
  FIRST_OFFER_MESSAGE,
  MAJOR_CONFETTI_MILESTONES,
  ROTATING_MILESTONE_MESSAGES,
  SPECIAL_MILESTONE_MESSAGES,
} from "./milestoneMessages";
import type { Application } from "./trackerTypes";

export type CelebrationKind =
  | "milestone"
  | "first-application"
  | "first-oa"
  | "first-interview"
  | "first-offer";

export interface Celebration {
  id: string;
  kind: CelebrationKind;
  title: string;
  message: string;
  confetti: boolean;
  /** For kind "milestone": the application-count threshold reached (5, 10,
   * 15, 20, 25, 30...) — lets the popup pick a slightly different accent
   * color/particle style per milestone without the logic layer knowing
   * anything about presentation. */
  milestoneNumber?: number;
}

export interface MilestoneState {
  seenThresholds: number[];
  firstApplicationSeen: boolean;
  firstOASeen: boolean;
  firstInterviewSeen: boolean;
  firstOfferSeen: boolean;
  /** Next index to pull from the rotating pool (for milestones past 25). */
  rotatingIndex: number;
}

export const INITIAL_MILESTONE_STATE: MilestoneState = {
  seenThresholds: [],
  firstApplicationSeen: false,
  firstOASeen: false,
  firstInterviewSeen: false,
  firstOfferSeen: false,
  rotatingIndex: 0,
};

const SUBMITTED_STATUSES = new Set(["Applied", "OA", "Interview", "Offer"]);

/** "Submitted" = CURRENT status is Applied, OA, Interview, or Offer.
 * Saved, Rejected, and Withdrawn never count — deliberately stricter than
 * the Applications dashboard's "Total Applied" stat (which counts
 * everything except Saved, including Rejected/Withdrawn, since that stat
 * answers a different question: "how many did I ever send out"). The
 * milestone system is celebrating active/successful progress, so an
 * application that ended in Rejected or Withdrawn stops counting toward
 * it — matching the feature spec's explicit exclusion list. */
export function countSubmitted(applications: Application[]): number {
  return applications.filter((a) => SUBMITTED_STATUSES.has(a.status)).length;
}

export function hasReachedOA(applications: Application[]): boolean {
  return computeApplicationStats(applications).oas > 0;
}

export function hasReachedInterview(applications: Application[]): boolean {
  return computeApplicationStats(applications).interviews > 0;
}

export function hasReachedOffer(applications: Application[]): boolean {
  return applications.some((a) => a.status === "Offer");
}

function multiplesOf5UpTo(count: number): number[] {
  const result: number[] = [];
  for (let m = 5; m <= count; m += 5) result.push(m);
  return result;
}

function buildMilestoneCelebration(threshold: number, rotatingIndex: number): Celebration {
  const special = SPECIAL_MILESTONE_MESSAGES[threshold];
  const confetti = MAJOR_CONFETTI_MILESTONES.includes(threshold);

  if (special) {
    return {
      id: `milestone-${threshold}`,
      kind: "milestone",
      title: special.title,
      message: special.message,
      confetti,
      milestoneNumber: threshold,
    };
  }

  const text = ROTATING_MILESTONE_MESSAGES[rotatingIndex % ROTATING_MILESTONE_MESSAGES.length];
  return {
    id: `milestone-${threshold}`,
    kind: "milestone",
    title: `${threshold} Applications Sent`,
    message: text,
    confetti,
    milestoneNumber: threshold,
  };
}

/** Given the current applications and the previously-stored milestone
 * state, returns any newly-earned celebrations plus the updated state to
 * persist. Pure and side-effect free so it can be unit-tested without any
 * React/storage plumbing.
 *
 * Every threshold not yet in `seenThresholds` pops a celebration — including
 * on the very first run, so a milestone that was already crossed before this
 * ever loaded (e.g. importing existing data, or the feature reaching a
 * browser that already had applications tracked) still celebrates it rather
 * than silently marking it "seen". */
export function computeMilestoneUpdate(
  applications: Application[],
  state: MilestoneState
): { celebrations: Celebration[]; nextState: MilestoneState } {
  const submitted = countSubmitted(applications);
  const oa = hasReachedOA(applications);
  const interview = hasReachedInterview(applications);
  const offer = hasReachedOffer(applications);
  const crossedThresholds = multiplesOf5UpTo(submitted);

  const celebrations: Celebration[] = [];
  let rotatingIndex = state.rotatingIndex;

  if (submitted >= 1 && !state.firstApplicationSeen) {
    celebrations.push({
      id: "first-application",
      kind: "first-application",
      title: FIRST_APPLICATION_MESSAGE.title,
      message: FIRST_APPLICATION_MESSAGE.message,
      confetti: false,
    });
  }

  const newThresholds = crossedThresholds.filter((t) => !state.seenThresholds.includes(t));
  for (const threshold of newThresholds) {
    celebrations.push(buildMilestoneCelebration(threshold, rotatingIndex));
    if (!SPECIAL_MILESTONE_MESSAGES[threshold]) rotatingIndex += 1;
  }

  if (oa && !state.firstOASeen) {
    celebrations.push({
      id: "first-oa",
      kind: "first-oa",
      title: FIRST_OA_MESSAGE.title,
      message: FIRST_OA_MESSAGE.message,
      confetti: false,
    });
  }

  if (interview && !state.firstInterviewSeen) {
    celebrations.push({
      id: "first-interview",
      kind: "first-interview",
      title: FIRST_INTERVIEW_MESSAGE.title,
      message: FIRST_INTERVIEW_MESSAGE.message,
      confetti: false,
    });
  }

  if (offer && !state.firstOfferSeen) {
    celebrations.push({
      id: "first-offer",
      kind: "first-offer",
      title: FIRST_OFFER_MESSAGE.title,
      message: FIRST_OFFER_MESSAGE.message,
      confetti: true,
    });
  }

  if (celebrations.length === 0) {
    return { celebrations: [], nextState: state };
  }

  return {
    celebrations,
    nextState: {
      seenThresholds: [...state.seenThresholds, ...newThresholds],
      firstApplicationSeen: state.firstApplicationSeen || submitted >= 1,
      firstOASeen: state.firstOASeen || oa,
      firstInterviewSeen: state.firstInterviewSeen || interview,
      firstOfferSeen: state.firstOfferSeen || offer,
      rotatingIndex,
    },
  };
}
