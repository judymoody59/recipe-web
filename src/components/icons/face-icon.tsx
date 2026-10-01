import type { IconProps } from './icon-props';

export function FaceIcon({ className }: IconProps) {
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
      <circle cx="23" cy="23" r="21" stroke="currentColor" strokeWidth="4" />
      <g fill="currentColor">
        <circle cx="15" cy="17.5" r="3.3" />
        <circle cx="31" cy="17.5" r="3.3" />
        <path d="M11.5 27h23a11.5 9 0 0 1-23 0Z" />
      </g>
    </svg>
  );
}
