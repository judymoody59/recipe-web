import type { IconProps } from './icon-props';

export function BadgeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="4">
        <path d="M29.5 13H40a4 4 0 0 1 4 4v23a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V17a4 4 0 0 1 4-4h10.5" />
        <rect x="16.5" y="2" width="13" height="17" rx="4" />
      </g>
      <g fill="currentColor">
        <circle cx="16" cy="26.5" r="3.3" />
        <path d="M9.5 37c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5h-13Z" />
        <rect x="27.5" y="24.5" width="9" height="3.5" />
        <rect x="27.5" y="31.5" width="9" height="3.5" />
      </g>
    </svg>
  );
}
