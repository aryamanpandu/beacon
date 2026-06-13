import { colors } from "./theme";

export function BeaconLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L12 8" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L7 20H17L12 8Z" stroke={colors.accent} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 20H15" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L4 5" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 8L20 5" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 8L2 10" stroke={colors.accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M12 8L22 10" stroke={colors.accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export const BookmarkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.8">
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
  </svg>
);

export const HistoryIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.8">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3.2 1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function GlobeIcon() {
  return (
    <svg className="w-2.5 h-2.5" fill="none" stroke={colors.accent} strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
