import type { IconProps } from './icon-props';

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="46"
      height="37"
      viewBox="0 0 46 37"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      className={className}
    >
      <rect x="2" y="2" width="42" height="33" rx="3" />
      <path d="m3.5 5 19.5 12.5L42.5 5" />
    </svg>
  );
}
