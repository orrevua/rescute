export function PawIcon({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Main pad */}
      <path
        d="M50 92c-18 0-30-14-30-28 0-10 8-18 16-22 4-2 9-3 14-3s10 1 14 3c8 4 16 12 16 22 0 14-12 28-30 28z"
        fill="currentColor"
      />
      {/* Top left toe */}
      <ellipse cx="24" cy="30" rx="10" ry="13" fill="currentColor" transform="rotate(-15 24 30)" />
      {/* Top center-left toe */}
      <ellipse cx="40" cy="18" rx="9" ry="13" fill="currentColor" transform="rotate(-5 40 18)" />
      {/* Top center-right toe */}
      <ellipse cx="60" cy="18" rx="9" ry="13" fill="currentColor" transform="rotate(5 60 18)" />
      {/* Top right toe */}
      <ellipse cx="76" cy="30" rx="10" ry="13" fill="currentColor" transform="rotate(15 76 30)" />
    </svg>
  );
}
