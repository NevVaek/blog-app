
export default function GarbageIcon({size=20, color = "gray", className}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <rect x="6" y="6" width="12" height="14" rx="2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    )
}