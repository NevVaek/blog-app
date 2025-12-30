
export default function PlusIcon({size=20, color="white"}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100">
            <rect x="45" y="10" width="10" height="80" fill={color}/>
            <rect x="10" y="45" width="80" height="10" fill={color}/>
        </svg>
    )
}