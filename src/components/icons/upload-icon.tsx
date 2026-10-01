import type { IconProps } from './icon-props';

export function UploadIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="67"
      height="67"
      viewBox="0 0 67 67"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      className={className}
    >
      <path d="M33.5 50V6" />
      <path d="m15.5 24 18-18 18 18" />
      <path d="M4 45.5V57a6 6 0 0 0 6 6h47a6 6 0 0 0 6-6V45.5" />
    </svg>
  );
}
