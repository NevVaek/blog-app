export default function ProgressRing({ progress }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="50" height="50">
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="#444"
        strokeWidth="4"
        fill="transparent"
      />
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="#3b82f6"
        strokeWidth="4"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
