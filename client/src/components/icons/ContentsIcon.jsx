export default function ContentsIcon({size=30, color="currentColor"}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="7" width="15" height="14" rx="2" />
            <rect x="6" y="3" width="15" height="14" rx="2" />
            <path d="M9 14l2-2 3 3 3-4" />
        </svg>
    );
}