export function UseIcon({ name }: { name: string }) {
  const common = "h-6 w-6";

  if (name === "gift") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 10v10M4 14h16" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 10c-2.2-3.5-6-2.2-6 0 0 1.6 2.4 2.4 6 2.4M12 10c2.2-3.5 6-2.2 6 0 0 1.6-2.4 2.4-6 2.4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  if (name === "makeup") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <rect x="7" y="3" width="5" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 13h3v7H8z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.5" cy="16.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "lunch") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <rect x="4" y="7" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
      <rect x="3.5" y="8" width="7" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 16.5h5.5v3.5H14z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
