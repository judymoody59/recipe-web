import type { IconProps } from './icon-props';

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M0 8h16.5" />
      <path d="m9.5 1 7 7-7 7" />
    </svg>
  );
}
