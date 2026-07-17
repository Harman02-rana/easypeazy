/** Fixed, hand-written content for the sister motivation system. Nothing
 * here is generated — every message is written once and stored as data. */

export interface MilestoneMessage {
  title: string;
  message: string;
}

/** The first five 5-application milestones get a personal message each. */
export const SPECIAL_MILESTONE_MESSAGES: Record<number, MilestoneMessage> = {
  5: {
    title: "5 down. This is just the beginning.",
    message:
      "Hey, I know 5 applications might not feel like a huge number, but you started — and that's what matters. Keep showing up. I'm always rooting for you. ❤️\n\n— Your Sister",
  },
  10: {
    title: "Double digits! Look at you go.",
    message:
      "10 applications done. Every application is one more door you've knocked on. Some will open, some won't — but you only need the right one. Keep going. You've got this.\n\n— Your Sister",
  },
  15: {
    title: "15 applications. Still going strong.",
    message:
      "I hope you remember that your worth is never decided by an acceptance or rejection email. Keep learning, keep applying, and keep becoming better every day. I'm already proud of how far you've come.\n\n— Your Sister",
  },
  20: {
    title: "20 opportunities chased.",
    message:
      "Twenty times you chose to try instead of wondering ‘what if’. That's something to be proud of. The right opportunity may be closer than you think. Don't stop now.\n\n— Your Sister",
  },
  25: {
    title: "25 applications! A message from your sister.",
    message:
      "If you're reading this, you've already put yourself out there 25 times. I made this little corner of the internet for you because I believe in what you're capable of. No matter how long the journey takes, keep moving forward. One day we'll look back at this phase and smile.\n\nI'm always on your team. ❤️\n\n— Your Sister",
  },
};

/** After the fifth special message (25), every further multiple of 5 pulls
 * the next entry from this fixed, rotating pool — sequential, so the same
 * message never appears twice in a row. */
export const ROTATING_MILESTONE_MESSAGES: string[] = [
  "Another 5 done. Consistency beats luck.",
  "Keep knocking. The right door only needs to open once.",
  "Progress isn't always visible, but every application counts.",
  "Five more chances created.",
  "Keep going. Future you will be glad you did.",
  "You can't control every outcome. You can control whether you keep trying.",
  "Another milestone reached. On to the next five.",
];

export const MAJOR_CONFETTI_MILESTONES = [25, 50, 100];

export const FIRST_APPLICATION_MESSAGE: MilestoneMessage = {
  title: "First one sent. The journey officially begins.",
  message: "",
};

export const FIRST_OA_MESSAGE: MilestoneMessage = {
  title: "Your first OA! Time to show them what you've been preparing for.",
  message: "",
};

export const FIRST_INTERVIEW_MESSAGE: MilestoneMessage = {
  title: "Your first interview! Take a moment to realize how far you've already come.",
  message: "",
};

export const FIRST_OFFER_MESSAGE: MilestoneMessage = {
  title: "YOU DID IT! ❤️",
  message:
    "All those applications, all that preparation, all the days you kept going even when things felt uncertain — they brought you here.\n\nI always knew you could do it.\n\nNow go celebrate. You earned this one.\n\n— Your very proud sister ❤️",
};

/** Small dashboard section, rotates once per day (deterministic by day of
 * year so it doesn't need its own storage key). */
export const MOTIVATION_CORNER_MESSAGES: string[] = [
  "Do today's work. Let tomorrow take care of itself.",
  "One application can change everything.",
  "Rejection is redirection. Keep applying.",
  "You're building your future one small step at a time.",
  "Don't compare your Chapter 1 with someone else's Chapter 10.",
  "Bad day? Do one small thing and call it progress.",
];

export function motivationCornerMessageForToday(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return MOTIVATION_CORNER_MESSAGES[dayOfYear % MOTIVATION_CORNER_MESSAGES.length];
}
