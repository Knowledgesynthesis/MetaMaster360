export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill="var(--primary)" />
      <g stroke="var(--primary-fg)" strokeWidth="3" strokeLinecap="round">
        <line x1="31" y1="10" x2="31" y2="54" opacity="0.45" />
        <line x1="14" y1="18" x2="34" y2="18" />
        <line x1="20" y1="28" x2="44" y2="28" />
        <line x1="12" y1="38" x2="30" y2="38" />
      </g>
      <g fill="var(--primary-fg)">
        <rect x="21" y="15" width="6" height="6" />
        <rect x="28.5" y="24.5" width="7" height="7" />
        <rect x="18" y="35" width="5" height="5" />
        <path d="M14 48 L23 44 L32 48 L23 52 Z" />
      </g>
    </svg>
  )
}
