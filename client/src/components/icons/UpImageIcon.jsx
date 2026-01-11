
export default function UpImageIcon({size=70, color = "currentColor", className}) {
    return (
        <svg
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="2" y="4" width="14" height="12" rx="2" ry="2" />
            <circle cx="7.5" cy="8" r="1.5" />
            <path d="M3 14l4-4 3 3 3-3 2 5" />

            <line x1="18" y1="8" x2="18" y2="14" />
            <line x1="15" y1="11" x2="21" y2="11" />
        </svg>
    )
}