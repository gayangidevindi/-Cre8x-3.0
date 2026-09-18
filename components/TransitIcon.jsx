'use client';

const PATHS = {
  pod: <><rect x="4" y="7" width="16" height="10" rx="5" /><path d="M8 17v2m8-2v2M7 11h10" /></>,
  bus: <><rect x="4" y="5" width="16" height="14" rx="3" /><path d="M7 19v2m10-2v2M7 9h10M7 14h.01M17 14h.01" /></>,
  train: <><rect x="5" y="3" width="14" height="16" rx="4" /><path d="M8 19l-2 2m10-2 2 2M8 8h8M8 13h.01M16 13h.01" /></>,
  air: <><path d="m3 12 18-6-6 18-3-8-9-4Z" /><path d="m12 16 3-3" /></>,
  plan: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4M11 8v6m-3-3h6" /></>,
  route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3v-3a3 3 0 0 1 3-3h1" /></>,
  live: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><path d="M12 2v2m10 8h-2M12 20v2M4 12H2" /></>,
  comfort: <><path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-6 17v-2a6 6 0 0 1 12 0v2" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  alert: <><path d="m12 3 9 16H3L12 3Z" /><path d="M12 9v4m0 3h.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
  sparkle: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Zm6 13 .6 2.4L21 19l-2.4.6L18 22l-.6-2.4L15 19l2.4-.6L18 16Z" /></>,
  orbital: <><circle cx="12" cy="12" r="3" /><path d="M4 12a8 4 0 1 0 16 0 8 4 0 1 0-16 0Zm8-8a4 8 0 1 0 0 16 4 8 0 1 0 0-16Z" /></>
};

export default function TransitIcon({ name, size = 22, title }) {
  return (
    <svg aria-hidden={title ? undefined : 'true'} aria-label={title} role={title ? 'img' : undefined}
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name] || PATHS.info}
    </svg>
  );
}