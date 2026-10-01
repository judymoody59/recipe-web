import type { IconProps } from './icon-props';

export function PersonIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="37"
      height="37"
      viewBox="0 0 37 37"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      className={className}
    >
      <circle cx="18.5" cy="9.5" r="7.5" />
      <path d="M2 35v-5c0-4.5 8-7.5 16.5-7.5S35 25.5 35 30v5H2Z" />
    </svg>
  );
}
