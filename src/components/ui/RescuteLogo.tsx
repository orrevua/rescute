export function RescuteLogo({
  className = '',
  height = 28,
}: {
  className?: string;
  height?: number;
}) {
  const width = Math.round(height * 4.2);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 100"
      width={width}
      height={height}
      className={className}
      aria-label="rescute"
      role="img"
    >
      <text
        x="0"
        y="78"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="88"
        letterSpacing="-2"
      >
        <tspan fill="#2d6a4f" fontWeight="400">
          res
        </tspan>
        <tspan fill="#1a3a38" fontWeight="900">
          cute
        </tspan>
      </text>
    </svg>
  );
}
