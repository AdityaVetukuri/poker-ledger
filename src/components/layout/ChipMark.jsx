export default function ChipMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="var(--gold)" strokeWidth="2" />
      <circle cx="20" cy="20" r="12.5" stroke="var(--gold)" strokeWidth="1.2" strokeDasharray="3 4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="19.1"
          y="1.5"
          width="1.8"
          height="6"
          rx="0.9"
          fill="var(--gold)"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="var(--gold)" />
    </svg>
  );
}
