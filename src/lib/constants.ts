export const APP_NAME = "Serbisyo360";
export const APP_TAGLINE = "Empowering Local Labor. Verified Feedback. Smarter LGU Decisions.";

export const SPECIALIZATIONS = [
  "Plumber", "Electrician", "Carpenter", "Welder",
  "Mason", "Painter", "Agricultural Worker", "Caregiver",
  "Mechanic", "Cleaner", "Driver", "Other"
];

export const MUNICIPALITIES = [
  "Quiapo", "Tondo", "Binondo", "Malate",
  "Ermita", "Paco", "Santa Ana", "San Miguel"
];

export const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

export const OTP_EXPIRY_MINUTES = 10;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "People", href: "/people" },
];