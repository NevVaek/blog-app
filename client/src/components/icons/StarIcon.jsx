export default function StarIcon({ filled = false, size = 20, className = "" }) {
  return filled ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.169L12 18.897l-7.336 3.87 1.402-8.169L.132 9.21l8.2-1.192L12 .587z"/>
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.169L12 18.897l-7.336 3.87 1.402-8.169L.132 9.21l8.2-1.192L12 .587z"/>
    </svg>
  );
}
