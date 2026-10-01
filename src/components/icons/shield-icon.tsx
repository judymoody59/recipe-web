import type { IconProps } from './icon-props';

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="37"
      height="46"
      viewBox="0 0 37 46"
      fill="none"
      className={className}
    >
      <path
        d="M18.5 2.5 35 8.6V21c0 10.2-6.6 18.7-16.5 22.6C8.6 39.7 2 31.2 2 21V8.6l16.5-6.1Z"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M18.5 14a4.5 4.5 0 0 1 2.3 8.4l1.2 7.1h-7l1.2-7.1A4.5 4.5 0 0 1 18.5 14Z"
        fill="currentColor"
      />
    </svg>
  );
}
